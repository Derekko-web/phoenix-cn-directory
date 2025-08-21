import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  Patch,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessQueryDto } from './dto';
import { BusinessStatus } from '@prisma/client';

@Controller('v1/businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  async getBusinesses(@Query() query: BusinessQueryDto) {
    return this.businessesService.findAll(query);
  }

  @Get(':slug')
  async getBusiness(
    @Param('slug') slug: string,
    @Query('locale') locale: 'en' | 'zh' = 'en'
  ) {
    return this.businessesService.findOne(slug, locale);
  }

  @Post()
  async createBusiness(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Put(':id')
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto
  ) {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBusiness(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }

  @Patch(':id/status')
  async updateBusinessStatus(
    @Param('id') id: string,
    @Body('status') status: BusinessStatus,
    @Body('rejectionReason') rejectionReason?: string
  ) {
    return this.businessesService.updateStatus(id, status, rejectionReason);
  }
}