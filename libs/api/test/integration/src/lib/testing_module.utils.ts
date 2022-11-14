import {
  ExecutionContext,
  INestApplication,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AuthGuard } from '@archie/api/utils/auth0';
import { verifyAccessToken } from './auth.utils';
import { queueStub } from './module-stubs/queue.stubs';
import { QueueService } from '@archie/api/utils/queue';
import { DataSource } from 'typeorm';
import {
  deleteTestDatabase,
  TestDatabase,
  truncateDatabase,
} from './database.utils';
// import * as winston from 'winston';
// import { WinstonModule } from 'nest-winston';

export const createTestingModule = (
  moduleMetadata: ModuleMetadata,
): TestingModuleBuilder => {
  return Test.createTestingModule(moduleMetadata)
    .overrideGuard(AuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        const accessToken: string = request.headers.authorization.split(' ')[1];

        request.user = verifyAccessToken(accessToken);

        return true;
      },
    })
    .overrideProvider(QueueService)
    .useValue(queueStub);
  // .setLogger(
  //   WinstonModule.createLogger({
  //     transports: [
  //       new winston.transports.Console({
  //         format: winston.format.combine(
  //           winston.format.timestamp(),
  //           winston.format.ms(),
  //           winston.format.json(),
  //         ),
  //       }),
  //     ],
  //   }),
  // );
};

export const initializeTestingModule = async (
  testingModule: TestingModule,
): Promise<INestApplication> => {
  const app = testingModule.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.init();

  return app;
};

export const cleanUpTestingModule = async (
  app: INestApplication,
  module: TestingModule,
  testDatabase?: TestDatabase,
): Promise<void> => {
  jest.resetAllMocks();

  const dataSource: DataSource = app.get(DataSource);

  if (!testDatabase) {
    await truncateDatabase(dataSource);
  }

  await app.close();
  await module.close();

  if (testDatabase) {
    if (!testDatabase.debug) {
      await deleteTestDatabase(testDatabase);
    }
  }
};
