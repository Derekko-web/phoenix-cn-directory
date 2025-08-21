import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClaimBusinessDto } from './dto';

@Injectable()
export class ClaimsService {
  constructor(private prisma: PrismaService) {}

  async claimBusiness(userId: string, claimBusinessDto: ClaimBusinessDto) {
    const { businessId, evidence } = claimBusinessDto;

    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { claims: true },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Check if business already has an owner
    if (business.ownerUserId) {
      throw new ConflictException('Business is already claimed');
    }

    // Check if user has already submitted a claim for this business
    const existingClaim = await this.prisma.claim.findFirst({
      where: {
        businessId,
        claimantUserId: userId,
      },
    });

    if (existingClaim) {
      throw new ConflictException('You have already submitted a claim for this business');
    }

    // Create new claim
    const claim = await this.prisma.claim.create({
      data: {
        businessId,
        claimantUserId: userId,
        evidence,
      },
      include: {
        business: {
          include: {
            localized: true,
          },
        },
        claimant: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return claim;
  }

  async getUserClaims(userId: string) {
    return this.prisma.claim.findMany({
      where: { claimantUserId: userId },
      include: {
        business: {
          include: {
            localized: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBusinessClaims(businessId: string) {
    return this.prisma.claim.findMany({
      where: { businessId },
      include: {
        claimant: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateClaimStatus(claimId: string, status: 'VERIFIED' | 'REJECTED', adminUserId: string) {
    // Check if the admin user has permission (this could be expanded with proper role checking)
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
    });

    if (!adminUser || !adminUser.roles.includes('admin')) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
      include: { business: true },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    // Update claim status
    const updatedClaim = await this.prisma.claim.update({
      where: { id: claimId },
      data: { verificationStatus: status },
      include: {
        business: true,
        claimant: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // If claim is verified, update business owner
    if (status === 'VERIFIED') {
      await this.prisma.business.update({
        where: { id: claim.businessId },
        data: { ownerUserId: claim.claimantUserId },
      });
    }

    return updatedClaim;
  }

  async getAllClaims(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const [claims, total] = await Promise.all([
      this.prisma.claim.findMany({
        skip: offset,
        take: limit,
        include: {
          business: {
            include: {
              localized: true,
            },
          },
          claimant: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.claim.count(),
    ]);

    return {
      claims,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}