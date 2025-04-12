import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicationModel,
  ApplicationSchema,
} from './infrastructure/models/application.model';
import { ApplicationController } from './infrastructure/controllers/application.controller';
import { ApplicationsService } from './application/services/applications.service';
import { MongooseApplicationRepository } from './infrastructure/repositories/mongoose/application.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/solar-applications'),
    MongooseModule.forFeature([
      {
        name: ApplicationModel.name,
        schema: ApplicationSchema,
      },
    ]),
  ],
  controllers: [AppController, ApplicationController],
  providers: [
    AppService,
    ApplicationsService,
    {
      provide: 'APPLICATIONS_REPOSITORY',
      useClass: MongooseApplicationRepository,
    },
  ],
})
export class AppModule {}
