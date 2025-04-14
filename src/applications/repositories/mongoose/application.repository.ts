import { Model, RootFilterQuery } from 'mongoose';
import { Application } from '../../../applications/domain/entities/application.entity';
import { ApplicationRepository } from '../../../applications/domain/repositories/application.repository';
import { ApplicationsModel } from '../../../applications/applications.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongooseApplicationRepository implements ApplicationRepository {
  constructor(
    @InjectModel(ApplicationsModel.name)
    private readonly applicationModel: Model<ApplicationsModel>,
  ) {}

  findAll(filters?: RootFilterQuery<Application>): Promise<Application[]> {
    return this.applicationModel.find(filters ?? {}).exec();
  }

  async findById(id: string): Promise<Application | null> {
    return this.applicationModel.findOne({ id }).lean().exec();
  }

  async create(
    application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Application> {
    return this.applicationModel.create(application);
  }

  update(
    id: string,
    application: Partial<Application>,
  ): Promise<Application | null> {
    return this.applicationModel
      .findOneAndUpdate({ id }, application, {
        new: true,
      })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  findByName(name: string): Promise<Application | null> {
    return this.applicationModel.findOne({ name }).exec();
  }

  async findDuplicates(name: string): Promise<Application[]> {
    const query: RootFilterQuery<Application> = {};

    // We can add more filter if needed
    if (name) {
      query.name = new RegExp(`${name}`, 'i');
    }

    return this.applicationModel.find(query).lean().exec();
  }
}
