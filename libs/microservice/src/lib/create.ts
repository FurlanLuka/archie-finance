import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export async function createMicroservice(
  name: string,
  module: unknown,
): Promise<INestApplication> {
  const app = await NestFactory.create(module, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            utilities.format.nestLike(`${name}`, { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  // });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(80);

  return app;
}
