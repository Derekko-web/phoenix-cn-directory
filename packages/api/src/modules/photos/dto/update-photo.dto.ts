import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoDto } from './create-photo.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}