import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../src/application/services/application.service';
import { ApplicationRepository } from '../src/domain/repositories/application.repository';
import {
  Application,
  ApplicationStatus,
} from '../src/domain/entities/application.entity';
import { ConflictException, NotFoundException } from '../src/utils/exceptions';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let mockRepository: jest.Mocked<ApplicationRepository>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: 'ApplicationRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
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
      mockRepository.findById.mockResolvedValue(mockApplication);

      const result = await service.getApplicationById('1');
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException if application not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.getApplicationById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      const newApp = {
        name: 'New App',
        description: 'New Desc',
        status: 'in_review' as ApplicationStatus,
      };
      const createdApp: Application = {
        ...newApp,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdApp);

      const result = await service.createApplication(newApp);
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
      mockRepository.findByName.mockResolvedValue(existingApp);

      await expect(
        service.createApplication({
          name: 'Existing App',
          description: 'New Desc',
          status: 'in_review',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
