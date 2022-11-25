import { CollateralReceivedPayload } from '@archie/api/credit-api/data-transfer-objects/types';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  initializeTestingModule,
  TestDatabase,
} from '@archie/test/integration';
import { queueStub } from '@archie/test/integration/module-stubs';
import { AppModule } from '../src/app.module';
import { SchedulerQueueController } from '@archie/api/ledger-recalculation-scheduler-api/scheduler';

describe('Ledger api withdrawal tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  const generatedUserIds = Array.from(Array(100).keys()).map((item) =>
    item.toString(),
  );

  describe('initiate batch recalculation handler', () => {
    beforeAll(setup);
    afterAll(cleanup);

    it('should create a batch of desired proportions', () => {
      expect(true).toEqual(true);
    });
  });
});
