import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { ApplicationsService } from 'src/application/services/applications.service';
import {
  Application,
  EnumApplicationStatus,
} from '../../domain/entities/application.entity';
import { CreateApplicationDto } from 'src/application/dto/create-application.dto';
import { UpdateApplicationDto } from 'src/application/dto/update-application.dto';
import { BadRequestException } from '@nestjs/common';

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let service: ApplicationsService;

  const mockApplication: Application = {
    id: '1',
    name: 'Test App',
    description: 'This is test description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockApplicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getApplicationsByStatus: jest.fn(),
    getDuplicateData: jest.fn(),
    importApplications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockApplicationsService,
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an application', async () => {
      const createDto: CreateApplicationDto = {
        name: 'Test App',
        description: 'This is description',
      };

      mockApplicationsService.create.mockResolvedValue(mockApplication);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockApplication);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all applications when no status is provided', async () => {
      mockApplicationsService.findAll.mockResolvedValue([mockApplication]);

      const result = await controller.findAll();
      expect(result).toEqual([mockApplication]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return applications by status when status is provided', async () => {
      const status = EnumApplicationStatus.IN_REVIEW;
      mockApplicationsService.getApplicationsByStatus.mockResolvedValue([
        mockApplication,
      ]);

      const result = await controller.findAll(status);
      expect(result).toEqual([mockApplication]);
      expect(service.getApplicationsByStatus).toHaveBeenCalledWith(status);
    });
  });

  describe('findDuplicates', () => {
    it('should return duplicate applications', async () => {
      const name = 'Test App';
      mockApplicationsService.getDuplicateData.mockResolvedValue([
        mockApplication,
      ]);

      const result = await controller.findDuplicates(name);
      expect(result).toEqual([mockApplication]);
      expect(service.getDuplicateData).toHaveBeenCalledWith(name);
    });
  });

  describe('findOne', () => {
    it('should return a single application', async () => {
      const id = '1';
      mockApplicationsService.findOne.mockResolvedValue(mockApplication);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockApplication);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an application', async () => {
      const id = '1';
      const updateDto: UpdateApplicationDto = {
        name: 'Updated App',
        status: EnumApplicationStatus.APPROVED,
      };

      mockApplicationsService.update.mockResolvedValue({
        ...mockApplication,
        ...updateDto,
      });

      const result = await controller.update(id, updateDto);
      expect(result).toEqual({ ...mockApplication, ...updateDto });
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an application', async () => {
      const id = '1';
      mockApplicationsService.remove.mockResolvedValue(true);

      const result = await controller.remove(id);
      expect(result).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('importApplications', () => {
    it('should import applications from file', async () => {
      const mockFile = {
        buffer: Buffer.from(JSON.stringify([mockApplication])),
      } as Express.Multer.File;

      const expectedResult = {
        succeed: [mockApplication],
        failed: [],
      };

      mockApplicationsService.importApplications.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.importApplications(mockFile);
      expect(result).toEqual(expectedResult);
      expect(service.importApplications).toHaveBeenCalledWith([
        mockApplication,
      ]);
    });

    it('should throw BadRequestException for invalid file content', async () => {
      const mockFile = {
        buffer: Buffer.from('invalid json'),
      } as Express.Multer.File;

      await expect(controller.importApplications(mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for empty file content', async () => {
      const mockFile = {
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      await expect(controller.importApplications(mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
