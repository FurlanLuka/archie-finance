import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Openapi } from '@archie-microservices/openapi';
import { AllExceptionsFilter } from '@archie-microservices/tracing';

export async function createMicroservice(
  name: string,
  module: unknown
): Promise<INestApplication> {
  const app = await NestFactory.create(module, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            // utilities.format.nestLike(`${name}`, { prettyPrint: false }),
          ),
        }),
      ],
    }),
  });


  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(80);

  await Openapi.generate(app);

  return app;
}
