import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MongooseApplicationRepository } from './repositories/mongoose/application.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsModel, ApplicationSchema } from './applications.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApplicationsModel.name,
        schema: ApplicationSchema,
      },
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    {
      provide: 'APPLICATIONS_REPOSITORY',
      useClass: MongooseApplicationRepository,
    },
  ],
})
export class ApplicationsModule {}
