import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  Application,
  ApplicationStatus,
} from './domain/entities/application.entity';

import { ApplicationsService } from '../applications/applications.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  findAll(
    @Query('status')
    status?: ApplicationStatus,
  ): Promise<Application[]> {
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

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { limits: { fieldSize: 5 * 1024 } }))
  async importApplications(@UploadedFile() file: Express.Multer.File): Promise<{
    succeed: Application[];
    failed: Array<{ application: Application; reason: unknown }>;
  }> {
    let applications: Application[];
    try {
      applications = JSON.parse(file?.buffer?.toString()) as Application[];
    } catch (error) {
      Logger.error('Error while parsing file content');
      Logger.error(error);
      throw new BadRequestException('Error while parsing file');
    }

    if (!applications) {
      throw new BadRequestException('No file content');
    }

    return this.applicationService.importApplications(applications);
  }
}
