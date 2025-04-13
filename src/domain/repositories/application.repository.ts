import { RootFilterQuery } from 'mongoose';
import {
  Application,
  ApplicationPayload,
} from '../entities/application.entity';

export interface ApplicationRepository {
  findAll(filters?: RootFilterQuery<Application>): Promise<Application[]>;
  findById(id: string): Promise<Application | null>;
  create(application: ApplicationPayload): Promise<Application>;
  update(
    id: string,
    application: Partial<Application | null>,
  ): Promise<Application | null>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Application | null>;
  findDuplicates(name: string): Promise<Application[]>;
}
