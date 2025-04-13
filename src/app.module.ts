import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { ApplicationsModule } from './applications/applications.module';
import configurations from './config/configurations';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('databaseUrl') as string;
        if (!databaseUrl) {
          throw new Error('Database URL is not configured');
        }
        return { uri: databaseUrl };
      },
      inject: [ConfigService],
    }),
    ApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
