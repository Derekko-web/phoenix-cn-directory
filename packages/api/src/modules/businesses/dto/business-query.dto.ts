import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BusinessStatus } from '@prisma/client';

export class BusinessQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const upper = value.toUpperCase();
      if (upper === 'APPROVED' || upper === 'PENDING' || upper === 'REJECTED') {
        return upper as BusinessStatus;
      }
    }
    return value;
  })
  @IsEnum(BusinessStatus)
  status?: BusinessStatus = BusinessStatus.APPROVED;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  locale?: 'en' | 'zh' = 'en';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: 'relevance' | 'name' | 'rating' | 'newest' | 'distance' = 'relevance';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}