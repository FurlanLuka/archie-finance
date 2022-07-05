import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Openapi } from '@archie-microservices/openapi';
import { RmqOptions } from '@nestjs/microservices';

export async function createMicroservice(
  name: string,
  module: unknown,
  microserviceOptions?: RmqOptions,
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

  if (microserviceOptions) {
    app.connectMicroservice<RmqOptions>(microserviceOptions);
    app.startAllMicroservices();
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(80);

  await Openapi.generate(app);

  return app;
}
