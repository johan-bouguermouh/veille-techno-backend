import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // add

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(3000);
}
bootstrap();
