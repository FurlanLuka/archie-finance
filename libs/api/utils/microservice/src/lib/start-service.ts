import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AllExceptionsFilter } from '@archie/api/utils/tracing';
import { BigNumber } from 'bignumber.js';
import { WsAdapter } from '@archie/api/websocket-event-api/websocket-event';
import { ScopeGuard } from '@archie/api/utils/auth0';
import { FastifyAdapter } from '@nestjs/platform-fastify';

export interface StartServiceOptions {
  enableWs?: boolean;
}

export async function startService(
  _name: string,
  module: unknown,
  options: StartServiceOptions = {
    enableWs: false,
  },
): Promise<INestApplication> {
  const app = await NestFactory.create(module, new FastifyAdapter(), {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), winston.format.json()),
        }),
      ],
    }),
    rawBody: true,
  });
  BigNumber.config({
    DECIMAL_PLACES: 18,
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    EXPONENTIAL_AT: 19,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  if (options.enableWs === true) {
    app.useWebSocketAdapter(new WsAdapter(app));
  }

  await app.listen(process.env.PORT ?? 80, '0.0.0.0');

  return app;
}
