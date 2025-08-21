import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePhotoDto, UpdatePhotoDto } from './dto';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async create(createPhotoDto: CreatePhotoDto) {
    if (!createPhotoDto.businessId) {
      throw new Error('businessId is required');
    }
    
    return this.prisma.photo.create({
      data: {
        url: createPhotoDto.url,
        storageKey: createPhotoDto.storageKey,
        originalName: createPhotoDto.originalName,
        mimeType: createPhotoDto.mimeType,
        size: createPhotoDto.size,
        businessId: createPhotoDto.businessId,
        caption: createPhotoDto.caption,
        status: 'PENDING', // All photos start as pending approval
      },
    });
  }

  async findAll(businessId?: string) {
    const where = businessId ? { businessId } : {};
    
    return this.prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(`Photo with ID '${id}' not found`);
    }

    return photo;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.findOne(id); // This will throw if not found

    return this.prisma.photo.update({
      where: { id },
      data: updatePhotoDto,
    });
  }

  async remove(id: string) {
    const photo = await this.findOne(id); // This will throw if not found

    await this.prisma.photo.delete({
      where: { id },
    });

    return { message: `Photo '${photo.originalName}' deleted successfully` };
  }

  async updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    const photo = await this.findOne(id); // This will throw if not found

    return this.prisma.photo.update({
      where: { id },
      data: { status },
    });
  }

  async getApprovedPhotos(businessId: string) {
    return this.prisma.photo.findMany({
      where: {
        businessId,
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}