import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { IsUniqueApplicationName } from '../../libs/validators/is-unique-application-name.validator';
import {
  ApplicationStatus,
  EnumApplicationStatus,
} from '../../applications/domain/entities/application.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsUniqueApplicationName)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsEnum(EnumApplicationStatus)
  @IsOptional()
  @ApiProperty()
  status?: ApplicationStatus = EnumApplicationStatus.IN_REVIEW;
}
