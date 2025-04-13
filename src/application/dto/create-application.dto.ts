import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { IsUniqueApplicationName } from 'src/common/validators/is-unique-application-name.validator';
import {
  ApplicationStatus,
  EnumApplicationStatus,
} from 'src/domain/entities/application.entity';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsUniqueApplicationName()
  name: string;

  @IsString()
  description: string;

  @IsEnum(EnumApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus = EnumApplicationStatus.IN_REVIEW;
}
