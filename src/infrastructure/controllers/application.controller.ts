import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  Application,
  ApplicationStatus,
} from '../../domain/entities/application.entity';
import { CreateApplicationDto } from 'src/application/dto/create-application.dto';
import { UpdateApplicationDto } from 'src/application/dto/update-application.dto';
import { ApplicationsService } from 'src/application/services/applications.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  findAll(@Query('status') status?: ApplicationStatus): Promise<Application[]> {
    if (status) {
      return this.applicationService.getApplicationsByStatus(status);
    }
    return this.applicationService.findAll();
  }

  @Get('duplicates')
  findDuplicates(@Query('name') name: string): Promise<Application[]> {
    return this.applicationService.getDuplicateData(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updates: UpdateApplicationDto,
  ): Promise<Application | null> {
    return this.applicationService.update(id, updates);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const result = await this.applicationService.remove(id);
    return { success: result };
  }
}
