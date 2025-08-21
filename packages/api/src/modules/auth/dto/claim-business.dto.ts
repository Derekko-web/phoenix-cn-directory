import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ClaimBusinessDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsOptional()
  @IsString()
  evidence?: string; // JSON string with verification evidence
}