import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { ApplicationRepository } from './domain/repositories/application.repository';
import {
  Application,
  EnumApplicationStatus,
} from './domain/entities/application.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  const mockApplicationRepository: jest.Mocked<ApplicationRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findDuplicates: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: 'APPLICATIONS_REPOSITORY',
          useValue: mockApplicationRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('getApplicationById', () => {
    it('should return an application if found', async () => {
      const mockApplication: Application = {
        id: '1',
        name: 'Test App',
        description: 'Test Desc',
        status: 'in_review',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockApplicationRepository.findById.mockResolvedValue(mockApplication);

      const result = await service.findOne('1');
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException if application not found', async () => {
      mockApplicationRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      const newApp = {
        name: 'New App',
        description: 'New Desc',
        status: EnumApplicationStatus.IN_REVIEW,
      };
      const createdApp: Application = {
        ...newApp,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockApplicationRepository.findByName.mockResolvedValue(null);
      mockApplicationRepository.findDuplicates.mockResolvedValue([]);
      mockApplicationRepository.create.mockResolvedValue(createdApp);

      const result = await service.create(newApp);
      expect(result).toEqual(createdApp);
    });

    it('should throw ConflictException if name already exists', async () => {
      const existingApp: Application = {
        id: '1',
        name: 'Existing App',
        description: 'Existing Desc',
        status: 'in_review',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockApplicationRepository.findByName.mockResolvedValue(existingApp);

      await expect(
        service.create({
          name: 'Existing App',
          description: 'New Desc',
          status: 'in_review',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
