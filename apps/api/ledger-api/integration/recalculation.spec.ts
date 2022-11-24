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
import * as request from 'supertest';
import { collateralDepositTransactionCompletedPayloadFactory } from '@archie/api/fireblocks-api/test-data';
import {
  DepositQueueController,
  LedgerQueueController,
} from '@archie/api/ledger-api/ledger';
import { AssetPrices } from '@archie/api/ledger-api/assets';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  LEDGER_ACCOUNT_UPDATED_TOPIC,
  LEDGER_ACCOUNTS_UPDATED_TOPIC,
} from '@archie/api/ledger-api/constants';
import { BigNumber } from 'bignumber.js';
import { initiateLedgerRecalcuationCommandPayloadFactory } from '@archie/api/ledger-api/test-data';
import { LedgerActionType } from '@archie/api/ledger-api/data-transfer-objects/types';

describe('Ledger api deposit tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;

  const BITCOIN_PRICE = 18_000;
  const ETH_PRICE = 2_000;
  const SOL_PRICE = 40;
  const USDC_PRICE = 1;

  const setAssetPrices = async (
    assetPrices: {
      assetId: string;
      price: number;
    }[],
  ): Promise<void> => {
    const assetPriceRepository: Repository<AssetPrices> = app.get(
      getRepositoryToken(AssetPrices),
    );

    await assetPriceRepository.save(
      assetPrices.map((record) => ({
        assetId: record.assetId,
        price: record.price,
        currency: 'USD',
        dailyChange: 1,
      })),
    );
  };

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    await setAssetPrices([
      {
        assetId: 'BTC',
        price: BITCOIN_PRICE,
      },
      {
        assetId: 'ETH',
        price: ETH_PRICE,
      },
      {
        assetId: 'SOL',
        price: SOL_PRICE,
      },
      {
        assetId: 'USDC',
        price: USDC_PRICE,
      },
    ]);
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  const generatedUserIds = Array.from(Array(100).keys()).map((item) =>
    item.toString(),
  );

  describe('Initiate ledger recalculation command', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const depositedAssetId = 'BTC';
    const depositedAssetAmount = '1';

    it(`should deposit assets to setup ledger for liquidation`, async () => {
      for (const userId in generatedUserIds) {
        const collateralDepositTransactionCompletedPayload =
          collateralDepositTransactionCompletedPayloadFactory({
            userId: userId,
            assetId: depositedAssetId,
            amount: depositedAssetAmount,
          });

        await app
          .get(DepositQueueController)
          .depositHandler(collateralDepositTransactionCompletedPayload);
      }

      expect(queueStub.publishEvent).toHaveBeenCalledTimes(100);
      generatedUserIds.forEach((userId, index) => {
        expect(queueStub.publishEvent).toHaveBeenNthCalledWith(
          index + 1,
          LEDGER_ACCOUNT_UPDATED_TOPIC,
          {
            userId,
            ledgerAccounts: [
              {
                assetId: depositedAssetId,
                assetAmount: depositedAssetAmount,
                accountValue: BigNumber(depositedAssetAmount)
                  .multipliedBy(BITCOIN_PRICE)
                  .decimalPlaces(2, BigNumber.ROUND_DOWN)
                  .toString(),
                assetPrice: BITCOIN_PRICE.toString(),
                calculatedAt: expect.any(String),
              },
            ],
            action: {
              type: LedgerActionType.DEPOSIT,
            },
          },
        );
      });
    });

    it('should publish events to start recalculating ledger values', async () => {
      queueStub.publishEvent.mockReset();

      await request(app.getHttpServer())
        .post('/internal/ledger/recalculate')
        .expect(201);

      expect(queueStub.publishEvent).toHaveBeenCalledTimes(100);
    });

    it('should handle the recalculation events and publish ledger updates', async () => {
      queueStub.publishEvent.mockReset();

      for (const userId in generatedUserIds) {
        const initiateLedgerRecalcuationCommandPayload =
          initiateLedgerRecalcuationCommandPayloadFactory({
            userIds: [userId],
          });

        await app
          .get(LedgerQueueController)
          .recalculationCommandHandler(
            initiateLedgerRecalcuationCommandPayload,
          );
      }

      expect(queueStub.publishEvent).toHaveBeenCalledTimes(100);
      generatedUserIds.forEach((userId, index) => {
        expect(queueStub.publishEvent).toHaveBeenNthCalledWith(
          index + 1,
          LEDGER_ACCOUNTS_UPDATED_TOPIC,
          {
            batchId: initiateLedgerRecalcuationCommandPayloadFactory().batchId,
            ledgers: [
              {
                userId,
                ledgerAccounts: [
                  {
                    assetId: depositedAssetId,
                    assetAmount: depositedAssetAmount,
                    accountValue: BigNumber(depositedAssetAmount)
                      .multipliedBy(BITCOIN_PRICE)
                      .decimalPlaces(2, BigNumber.ROUND_DOWN)
                      .toString(),
                    assetPrice: BITCOIN_PRICE.toString(),
                    calculatedAt: expect.any(String),
                  },
                ],
                action: {
                  type: LedgerActionType.ASSET_PRICE_UPDATE,
                },
              },
            ],
          },
        );
      });
    });
  });
});
