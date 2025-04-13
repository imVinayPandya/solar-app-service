import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './libs/utils/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT')!;

  const docBuilder = new DocumentBuilder()
    .setTitle('Solar Application')
    .setDescription('The solar application API description')
    .setVersion('1.0')
    .addTag('application')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, docBuilder);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => {
    Logger.log(`🚀 Application is running on http://localhost:${port}`);
  });
}
bootstrap();
