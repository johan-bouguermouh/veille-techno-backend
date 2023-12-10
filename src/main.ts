import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // add
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { UniqueConstraintViolationFilter } from './filters/user-email-unique.filter';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });
  const config = new DocumentBuilder() // add
    .setTitle('NestJS API example')
    .setDescription(
      "Vous trouverez ici la documentation de l'API de notre projet sur NestJS",
    )
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
    .build();

  const document = SwaggerModule.createDocument(app, config); // add
  SwaggerModule.setup('api', app, document); // add
  app.useGlobalPipes(new ValidationPipe()); // add
  app.useGlobalFilters(new UniqueConstraintViolationFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter()); // add
  await app.listen(3000);
}
bootstrap();
