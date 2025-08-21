import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { ClaimBusinessDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('claims')
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async claimBusiness(
    @CurrentUser() user: any,
    @Body() claimBusinessDto: ClaimBusinessDto,
  ) {
    return this.claimsService.claimBusiness(user.id, claimBusinessDto);
  }

  @Get('my-claims')
  @UseGuards(JwtAuthGuard)
  async getUserClaims(@CurrentUser() user: any) {
    return this.claimsService.getUserClaims(user.id);
  }

  @Get('business/:businessId')
  @UseGuards(JwtAuthGuard)
  async getBusinessClaims(@Param('businessId') businessId: string) {
    return this.claimsService.getBusinessClaims(businessId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllClaims(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.claimsService.getAllClaims(pageNum, limitNum);
  }

  @Patch(':claimId/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateClaimStatus(
    @Param('claimId') claimId: string,
    @Body('status') status: 'VERIFIED' | 'REJECTED',
    @CurrentUser() user: any,
  ) {
    return this.claimsService.updateClaimStatus(claimId, status, user.id);
  }
}