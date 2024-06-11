import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { loggerOption } from './config/logger.config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(loggerOption),
  });
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Hi-level Assignment')
    .setDescription('The Hi-level API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    }),
  );

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap().then(() => {
  console.log('Server is running');
});
