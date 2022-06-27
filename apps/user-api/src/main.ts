import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import './tracer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            // utilities.format.nestLike('API', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder()
      // .setTitle('Cats example')
      // .setDescription('The cats API description')
      // .setVersion('1.0')
      // .addTag('cats')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  console.log(JSON.stringify(document))

  await app.listen(80);
}
bootstrap();
