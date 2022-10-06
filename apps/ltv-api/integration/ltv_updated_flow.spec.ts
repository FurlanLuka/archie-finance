import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  generateUserAccessToken,
  initializeTestingModule,
  TestDatabase,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { LtvQueueController } from '@archie/api/ltv-api/ltv';
import { ledgerAccountUpdatedPayloadFactory } from '@archie/api/ledger-api/test-data';
import { LtvDto, LtvStatus } from '@archie/api/ltv-api/ltv';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';

describe('Ltv api tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Receive ledger value update', () => {
    beforeAll(setup);
    afterAll(cleanup);

    it(`should keep ltv at 0 as credit was not created yet`, async () => {
      const ledgerUpdatedPayload = ledgerAccountUpdatedPayloadFactory();

      await app.get(LtvQueueController).ledgerUpdated(ledgerUpdatedPayload);
      const response = await request(app.getHttpServer())
        .get('/v1/ltv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<LtvDto>({
        ltv: 0,
        status: LtvStatus.good,
      });
    });

    it(`should keep ltv at 0 when the credit line is created`, async () => {
      const creditLineCreatedPayload = creditLineCreatedDataFactory();

      await app
        .get(LtvQueueController)
        .creditLineCreatedHandler(creditLineCreatedPayload);
      const response = await request(app.getHttpServer())
        .get('/v1/ltv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<LtvDto>({
        ltv: 0,
        status: LtvStatus.good,
      });
    });
  });
});
