import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationRepository } from '../../domain/repositories/application.repository';
import {
  Application,
  ApplicationStatus,
} from '../../domain/entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject('APPLICATIONS_REPOSITORY')
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async create(application: CreateApplicationDto): Promise<Application> {
    const existingApplication = await this.applicationRepository.findByName(
      application.name,
    );
    if (existingApplication) {
      throw new ConflictException('Application with this name already exists');
    }
    return this.applicationRepository.create(application);
  }

  findAll(): Promise<Application[]> {
    return this.applicationRepository.findAll();
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async update(
    id: string,
    updates: UpdateApplicationDto,
  ): Promise<Application | null> {
    const existingApplication = await this.applicationRepository.findById(id);
    if (!existingApplication) {
      throw new NotFoundException('Application not found');
    }

    if (updates.name && updates.name !== existingApplication.name) {
      const applicationWithSameName =
        await this.applicationRepository.findByName(updates.name);
      if (applicationWithSameName && applicationWithSameName.id !== id) {
        throw new ConflictException(
          'Another application with this name already exists',
        );
      }
    }

    return this.applicationRepository.update(id, updates);
  }

  async remove(id: string): Promise<boolean> {
    const existingApplication = await this.applicationRepository.findById(id);
    if (!existingApplication) {
      throw new NotFoundException('Application not found');
    }
    return this.applicationRepository.delete(id);
  }

  async getApplicationsByStatus(
    status: ApplicationStatus,
  ): Promise<Application[]> {
    const allApplications = await this.applicationRepository.findAll();
    return allApplications.filter((app) => app.status === status);
  }

  async getDuplicateData(name: string): Promise<Application[]> {
    if (!name) {
      throw new BadRequestException();
    }
    return this.applicationRepository.findDuplicates(name);
  }
}
