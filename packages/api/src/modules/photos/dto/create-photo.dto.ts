import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  url: string;

  @IsString()
  storageKey: string;

  @IsString()
  originalName: string;

  @IsString()
  mimeType: string;

  @IsNumber()
  size: number;

  @IsOptional()
  @IsUUID()
  businessId?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}