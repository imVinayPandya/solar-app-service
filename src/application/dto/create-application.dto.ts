import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ApplicationStatus {
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class CreateApplicationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus; // Defaults to 'in_review'
}
