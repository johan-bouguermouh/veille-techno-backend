import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // add
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { UniqueConstraintViolationFilter } from './filters/user-email-unique.filter';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';
import { readFileSync } from 'fs';
import { join } from 'path';

const readme = readFileSync(join(__dirname, '../README.swagger.md'), 'utf8');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });
  const config = new DocumentBuilder() // add
    .setTitle('NestJS API example')
    //we create description in markdown
    .setDescription(readme)
    .setVersion('1.0')
    .addTag('NestJS')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'X-Refresh-Token',
        description: 'Enter JWT refresh token',
        in: 'header',
      },
      'JWT-refresh-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config); // add
  SwaggerModule.setup('api', app, document); // add
  app.useGlobalPipes(new ValidationPipe()); // add
  app.useGlobalFilters(new UniqueConstraintViolationFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter()); // add
  await app.listen(3000);
}
bootstrap();
