import { INestApplication, Logger } from '@nestjs/common';
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
import {
  ledgerAccountDataFactory,
  ledgerAccountUpdatedPayloadFactory,
} from '@archie/api/ledger-api/test-data';
import { CreditLineQueueController } from '@archie/api/credit-line-api/credit-line';
import * as request from 'supertest';
import { DateTime } from 'luxon';

describe('Credit line creation tests', () => {
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

  describe('Create and update credit line after ledger value swings for more then 10%', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const bitcoinLedgerAccount = ledgerAccountDataFactory({
      assetId: 'BTC',
      assetAmount: '0.2',
      accountValue: '2000',
    });

    const ethereumLedgerAccount = ledgerAccountDataFactory({
      assetId: 'ETH',
      assetAmount: '0.8',
      accountValue: '1000',
    });

    it('should fail creating credit line because user does not have collateral', async () => {
      const response = await request(app.getHttpServer())
        .post('/v2/credit_lines')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toStrictEqual('NOT_ENOUGH_COLLATERAL');
    });

    it('should create a credit line', async () => {
      const ledgerUpdatedPayload = ledgerAccountUpdatedPayloadFactory({
        ledgerAccounts: [bitcoinLedgerAccount, ethereumLedgerAccount],
      });

      await app
        .get(CreditLineQueueController)
        .ledgerUpdated(ledgerUpdatedPayload);

      const response = await request(app.getHttpServer())
        .post('/v2/credit_lines')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toStrictEqual({
        creditLimit: 1900,
        creditLimitAssetAllocation: [
          {
            assetId: bitcoinLedgerAccount.assetId,
            allocationPercentage: 68.43,
            allocatedAssetValue: Number(bitcoinLedgerAccount.accountValue),
          },
          {
            assetId: ethereumLedgerAccount.assetId,
            allocationPercentage: 31.58,
            allocatedAssetValue: Number(ethereumLedgerAccount.accountValue),
          },
        ],
      });
    });

    it('should fail creating another credit line because user already has credit line created', async () => {
      const response = await request(app.getHttpServer())
        .post('/v2/credit_lines')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(409);

      expect(response.body.message).toStrictEqual('CREDIT_LINE_ALREADY_EXISTS');
    });

    const updatedBitcoinAccountAccount = ledgerAccountDataFactory({
      ...bitcoinLedgerAccount,
      accountValue: '3000',
      calculatedAt: DateTime.now().plus({ minute: 1 }).toISO(),
    });

    it('should update the credit line because ledger value increased by 10% and return the overcollateralized response', async () => {
      const ledgerUpdatedPayload = ledgerAccountUpdatedPayloadFactory({
        ledgerAccounts: [updatedBitcoinAccountAccount],
      });

      await app
        .get(CreditLineQueueController)
        .ledgerUpdated(ledgerUpdatedPayload);

      const response = await request(app.getHttpServer())
        .get('/v2/credit_lines')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        creditLimit: 2000,
        creditLimitAssetAllocation: [
          {
            assetId: bitcoinLedgerAccount.assetId,
            allocationPercentage: 97.5,
            allocatedAssetValue: Number(
              updatedBitcoinAccountAccount.accountValue,
            ),
          },
          {
            assetId: ethereumLedgerAccount.assetId,
            allocationPercentage: 2.5,
            allocatedAssetValue: 83.33,
          },
        ],
      });
    });
  });
});
