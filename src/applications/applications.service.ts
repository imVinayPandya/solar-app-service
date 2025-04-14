import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationRepository } from './domain/repositories/application.repository';
import {
  Application,
  ApplicationStatus,
} from './domain/entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject('APPLICATIONS_REPOSITORY')
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  private async removeDuplicates(
    applications: CreateApplicationDto[],
  ): Promise<CreateApplicationDto[]> {
    const uniqueNames = new Set<string>();
    const result: CreateApplicationDto[] = [];

    for (const app of applications) {
      if (!uniqueNames.has(app.name)) {
        const exists = await this.applicationRepository.findByName(app.name);
        if (!exists) {
          uniqueNames.add(app.name);
          result.push(app);
        }
      }
    }

    return result;
  }

  create = async (application: CreateApplicationDto): Promise<Application> => {
    // exact duplicate name matching
    const existingApplication = await this.applicationRepository.findByName(
      application.name,
    );
    if (existingApplication) {
      throw new ConflictException('Application with this name already exists');
    }

    // Additional duplicate checks
    const potentialDuplicates = await this.applicationRepository.findDuplicates(
      application.name,
    );

    if (potentialDuplicates?.length > 0) {
      throw new ConflictException('Potential duplicate application detected');
    }

    return this.applicationRepository.create(application);
  };

  findAll = (): Promise<Application[]> => {
    return this.applicationRepository.findAll();
  };

  findOne = async (id: string): Promise<Application> => {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  };

  update = async (
    id: string,
    updates: UpdateApplicationDto,
  ): Promise<Application | null> => {
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
  };

  remove = async (id: string): Promise<boolean> => {
    const existingApplication = await this.applicationRepository.findById(id);
    if (!existingApplication) {
      throw new NotFoundException('Application not found');
    }
    return this.applicationRepository.delete(id);
  };

  getApplicationsByStatus = async (
    status: ApplicationStatus,
  ): Promise<Application[]> => {
    return this.applicationRepository.findAll({ status });
  };

  getDuplicateData = async (name: string): Promise<Application[]> => {
    if (!name) {
      throw new BadRequestException();
    }
    return this.applicationRepository.findDuplicates(name);
  };

  importApplications = async (
    applications: CreateApplicationDto[],
  ): Promise<{
    succeed: Application[];
    failed: Array<{ application: Application; reason: unknown }>;
  }> => {
    const uniqueApplications = await this.removeDuplicates(applications);

    if (!uniqueApplications?.length) {
      Logger.log('No unique record found in the json file');
      throw new ConflictException('No unique records found');
    }

    const results = await Promise.allSettled(
      uniqueApplications.map((app) => this.create(app)),
    );

    const succeed: Application[] = [];
    const failed: Array<{ application: Application; reason: unknown }> = [];

    results.forEach((result: PromiseSettledResult<Application>) => {
      if (result.status === 'rejected') {
        failed.push({
          application: {} as Application,
          reason: result.reason as unknown,
        });
        return;
      }

      succeed.push(result.value);
    });

    return {
      succeed,
      failed,
    };
  };
}
