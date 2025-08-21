import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { SearchService } from '../../common/search/search.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessQueryDto } from './dto';
import { BusinessStatus } from '@prisma/client';

@Injectable()
export class BusinessesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private searchService: SearchService
  ) {}

  async findAll(query: BusinessQueryDto) {
    const {
      status = BusinessStatus.APPROVED,
      category,
      city,
      state,
      locale = 'en',
      limit = 20,
      offset = 0,
      search
    } = query;

    try {
      // Ensure limit and offset are numbers
      const numLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const numOffset = typeof offset === 'string' ? parseInt(offset, 10) : offset;

      const where: any = { status };

      // Add category filter
      if (category) {
        where.categories = {
          some: {
            category: {
              key: category
            }
          }
        };
      }

      // Add location filter
      if (city) {
        where.location = { city };
      }
      if (state) {
        where.location = { ...where.location, state };
      }

      // Add search filter across localized names
      if (search) {
        where.localized = {
          some: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } }
            ]
          }
        };
      }

      // Debug log before executing queries
      console.log('[BusinessesService.findAll] query', {
        status,
        category,
        city,
        state,
        locale,
        limit: numLimit,
        offset: numOffset,
        search
      });

      const [businesses, total] = await Promise.all([
        this.prisma.business.findMany({
          where,
          include: {
            localized: {
              where: { lang: locale }
            },
            contact: true,
            location: true,
            hours: {
              orderBy: { dayOfWeek: 'asc' }
            },
            categories: {
              include: {
                category: true
              }
            },
            photos: {
              where: { status: 'APPROVED' },
              take: 3
            }
          },
          take: numLimit,
          skip: numOffset,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.business.count({ where })
      ]);

      return {
        businesses,
        total,
        limit: numLimit,
        offset: numOffset
      };
    } catch (e: any) {
      console.error('[BusinessesService.findAll] error', {
        name: e?.name,
        code: e?.code,
        message: e?.message,
        meta: e?.meta
      });
      throw e;
    }
  }

  async findOne(slug: string, locale = 'en') {
    const business = await this.prisma.business.findFirst({
      where: {
        OR: [
          { slug },
          { localized: { some: { slugLocalized: slug } } }
        ]
      },
      include: {
        localized: true,
        contact: true,
        location: true,
        hours: {
          orderBy: { dayOfWeek: 'asc' }
        },
        categories: {
          include: {
            category: true
          }
        },
        photos: {
          where: { status: 'APPROVED' }
        },
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: { id: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!business) {
      throw new NotFoundException(`Business with slug '${slug}' not found`);
    }

    return business;
  }

  async create(createBusinessDto: CreateBusinessDto) {
    const { localized, contact, location, hours, categoryIds, ...businessData } = createBusinessDto;

    // Generate slug from English name
    const englishName = localized.find(l => l.lang === 'en')?.name || 
                       localized[0]?.name || 
                       'business';
    const baseSlug = this.generateSlug(englishName);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const business = await this.prisma.business.create({
      data: {
        ...businessData,
        slug,
        localized: {
          create: localized.map(l => ({
            ...l,
            slugLocalized: l.lang === 'en' ? slug : this.generateSlug(l.name)
          }))
        },
        contact: contact ? { create: contact } : undefined,
        location: location ? { create: location } : undefined,
        hours: hours && hours.length > 0 ? { create: hours } : undefined,
        categories: categoryIds && categoryIds.length > 0 ? {
          create: categoryIds.map(categoryId => ({ categoryId }))
        } : undefined
      },
      include: {
        localized: true,
        contact: true,
        location: true,
        hours: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    // Send email notifications asynchronously
    this.sendBusinessSubmissionEmails(business).catch(error => {
      console.error('Failed to send business submission emails:', error);
    });

    // Index business in search if approved
    if (business.status === 'APPROVED') {
      this.searchService.indexBusiness(business).catch(error => {
        console.error('Failed to index business in search:', error);
      });
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with ID '${id}' not found`);
    }

    const { localized, contact, location, hours, categoryIds, ...businessData } = updateBusinessDto;

    const updateData: any = { ...businessData };

    // Handle localized updates
    if (localized && localized.length > 0) {
      await this.prisma.businessLocalized.deleteMany({ where: { businessId: id } });
      updateData.localized = {
        create: localized.map(l => ({
          ...l,
          slugLocalized: l.lang === 'en' ? business.slug : this.generateSlug(l.name)
        }))
      };
    }

    // Handle contact updates
    if (contact) {
      updateData.contact = { upsert: { create: contact, update: contact } };
    }

    // Handle location updates
    if (location) {
      updateData.location = { upsert: { create: location, update: location } };
    }

    // Handle hours updates
    if (hours) {
      await this.prisma.businessHours.deleteMany({ where: { businessId: id } });
      if (hours.length > 0) {
        updateData.hours = { create: hours };
      }
    }

    // Handle category updates
    if (categoryIds) {
      await this.prisma.businessCategory.deleteMany({ where: { businessId: id } });
      if (categoryIds.length > 0) {
        updateData.categories = {
          create: categoryIds.map(categoryId => ({ categoryId }))
        };
      }
    }

    const updatedBusiness = await this.prisma.business.update({
      where: { id },
      data: updateData,
      include: {
        localized: true,
        contact: true,
        location: true,
        hours: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    // Update in search index if approved
    if (updatedBusiness.status === 'APPROVED') {
      this.searchService.updateBusiness(id, updatedBusiness).catch(error => {
        console.error('Failed to update business in search:', error);
      });
    } else if (business.status === 'APPROVED') {
      // If business was approved but now isn't, remove from search
      this.searchService.deleteBusiness(id).catch(error => {
        console.error('Failed to remove business from search:', error);
      });
    }

    return updatedBusiness;
  }

  async remove(id: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with ID '${id}' not found`);
    }

    await this.prisma.business.delete({ where: { id } });
    
    // Remove from search index
    this.searchService.deleteBusiness(id).catch(error => {
      console.error('Failed to remove business from search:', error);
    });
    
    return { message: `Business '${business.slug}' deleted successfully` };
  }

  async updateStatus(id: string, status: BusinessStatus, rejectionReason?: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        localized: true,
        contact: true,
        location: true
      }
    });
    
    if (!business) {
      throw new NotFoundException(`Business with ID '${id}' not found`);
    }

    const updatedBusiness = await this.prisma.business.update({
      where: { id },
      data: { status },
      include: {
        localized: true,
        contact: true,
        location: true
      }
    });

    // Send status update email if contact email is available and status changed to APPROVED or REJECTED
    if (business.contact?.email && business.status !== status && (status === 'APPROVED' || status === 'REJECTED')) {
      const englishLocalized = business.localized.find(l => l.lang === 'en');
      const businessName = englishLocalized?.name || business.localized[0]?.name || 'Business';
      
      this.emailService.sendBusinessStatusUpdate(
        business.contact.email,
        businessName,
        status,
        'en', // Default to English for status updates
        rejectionReason
      ).catch(error => {
        console.error('Failed to send status update email:', error);
      });
    }

    // Handle search indexing based on status change
    if (business.status !== status) {
      if (status === 'APPROVED') {
        // Index the business when approved
        this.searchService.indexBusiness(updatedBusiness).catch(error => {
          console.error('Failed to index business in search:', error);
        });
      } else if (business.status === 'APPROVED') {
        // Remove from search if was approved but now rejected/pending
        this.searchService.deleteBusiness(id).catch(error => {
          console.error('Failed to remove business from search:', error);
        });
      }
    }

    return updatedBusiness;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private async sendBusinessSubmissionEmails(business: any): Promise<void> {
    try {
      const englishLocalized = business.localized.find(l => l.lang === 'en');
      const chineseLocalized = business.localized.find(l => l.lang === 'zh');
      
      const businessName = englishLocalized?.name || business.localized[0]?.name || 'Business';
      const businessNameChinese = chineseLocalized?.name;
      
      // Send confirmation email to submitter if email is provided
      if (business.contact?.email) {
        await this.emailService.sendBusinessSubmissionConfirmation(
          business.contact.email,
          {
            businessName,
            businessNameChinese,
            submissionId: business.id,
            contactEmail: business.contact.email,
            locale: 'en', // Default to English, could be determined by user preference
          }
        );
      }

      // Send notification to admin
      const categories = business.categories?.map(bc => 
        bc.category?.nameEn || 'Unknown Category'
      ) || [];
      
      const location = business.location ? 
        `${business.location.city}, ${business.location.state} ${business.location.zip}` : 
        'Location not provided';

      await this.emailService.sendAdminNotification({
        businessName,
        businessNameChinese,
        submissionId: business.id,
        submitterEmail: business.contact?.email,
        categories,
        location,
        contactInfo: {
          phone: business.contact?.phone,
          email: business.contact?.email,
          website: business.contact?.website,
        },
      });
    } catch (error) {
      console.error('Error sending business submission emails:', error);
      throw error;
    }
  }
}