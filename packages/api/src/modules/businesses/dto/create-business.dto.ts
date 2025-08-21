import { IsString, IsOptional, IsArray, IsEnum, ValidateNested, IsNotEmpty, IsEmail, IsUrl, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BusinessStatus } from '@prisma/client';

class CreateBusinessLocalizedDto {
  @IsString()
  @IsNotEmpty()
  lang: 'en' | 'zh';

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

class CreateBusinessContactDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUrl()
  @IsOptional()
  website?: string;
}

class CreateBusinessLocationDto {
  @IsArray()
  @IsString({ each: true })
  addressLines: string[];

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip: string;
}

class CreateBusinessHoursDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @IsOptional()
  openTime?: string;

  @IsString()
  @IsOptional()
  closeTime?: string;

  @IsBoolean()
  @IsOptional()
  is24h?: boolean = false;
}

export class CreateBusinessDto {
  @IsEnum(BusinessStatus)
  @IsOptional()
  status?: BusinessStatus = BusinessStatus.PENDING;

  @IsString()
  @IsOptional()
  ownerUserId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessLocalizedDto)
  localized: CreateBusinessLocalizedDto[];

  @ValidateNested()
  @Type(() => CreateBusinessContactDto)
  @IsOptional()
  contact?: CreateBusinessContactDto;

  @ValidateNested()
  @Type(() => CreateBusinessLocationDto)
  @IsOptional()
  location?: CreateBusinessLocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessHoursDto)
  @IsOptional()
  hours?: CreateBusinessHoursDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}