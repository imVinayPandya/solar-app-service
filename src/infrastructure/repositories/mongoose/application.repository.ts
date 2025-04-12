import { Model, RootFilterQuery } from 'mongoose';
import { Application } from '../../../domain/entities/application.entity';
import { ApplicationRepository } from '../../../domain/repositories/application.repository';
import { ApplicationModel } from '../../models/application.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongooseApplicationRepository implements ApplicationRepository {
  constructor(
    @InjectModel(ApplicationModel.name)
    private readonly applicationModel: Model<ApplicationModel>,
  ) {}

  findAll(): Promise<Application[]> {
    return this.applicationModel.find({}).exec();
  }

  async findById(id: string): Promise<Application | null> {
    return this.applicationModel.findById(id).lean().exec();
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
      .findByIdAndUpdate(id, application, {
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
      query.name = new RegExp(`${name}`);
    }

    return this.applicationModel.find(query).lean().exec();
  }
}
