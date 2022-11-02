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
import { queueStub, user } from '@archie/test/integration/stubs';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  Ledger,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects';
import { collateralDepositTransactionCompletedPayloadFactory } from '@archie/api/fireblocks-api/test-data';
import { DepositQueueController } from '@archie/api/ledger-api/ledger';
import { AssetPrices } from '@archie/api/ledger-api/assets';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BigNumber } from 'bignumber.js';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';

describe('Ledger api deposit tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

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

    accessToken = generateUserAccessToken();

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

  describe('Receive deposit and create and update ledger', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const firstDepositAssetId = 'BTC';
    const firstdepositAssetAmount = '1';

    const firstDepositAccountValue = BigNumber(firstdepositAssetAmount)
      .multipliedBy(BITCOIN_PRICE)
      .decimalPlaces(2, BigNumber.ROUND_DOWN);

    const secondDepositAssetId = 'ETH';
    const secondDepositAssetAmount = '0.94823';

    const secondDepositAccountValue = BigNumber(secondDepositAssetAmount)
      .multipliedBy(ETH_PRICE)
      .decimalPlaces(2, BigNumber.ROUND_DOWN);

    it(`should return en empty ledger because user hasn't deposited any collateral yet`, async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<Ledger>({
        value: '0',
        accounts: [],
      });
    });

    it('should return ledger with one account after the collateral deposit has been received', async () => {
      const collateralDepositTransactionCompletedPayload =
        collateralDepositTransactionCompletedPayloadFactory({
          assetId: firstDepositAssetId,
          amount: firstdepositAssetAmount,
        });

      await app
        .get(DepositQueueController)
        .depositHandler(collateralDepositTransactionCompletedPayload);

      const response = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<Ledger>({
        value: firstDepositAccountValue.toString(),
        accounts: [
          {
            assetAmount: firstdepositAssetAmount,
            assetId: firstDepositAssetId,
            assetPrice: BITCOIN_PRICE.toString(),
            accountValue: firstDepositAccountValue.toString(),
          },
        ],
      });

      expect(queueStub.publishEvent).toHaveBeenNthCalledWith(
        1,
        LEDGER_ACCOUNT_UPDATED_TOPIC,
        {
          userId: user.id,
          ledgerAccounts: [
            {
              assetId: firstDepositAssetId,
              assetAmount: firstdepositAssetAmount,
              accountValue: firstDepositAccountValue.toString(),
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

    it('should return ledger with two accounts after another deposit has been made', async () => {
      const collateralDepositTransactionCompletedPayload =
        collateralDepositTransactionCompletedPayloadFactory({
          assetId: secondDepositAssetId,
          amount: secondDepositAssetAmount,
        });

      await app
        .get(DepositQueueController)
        .depositHandler(collateralDepositTransactionCompletedPayload);

      const response = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<Ledger>({
        value: firstDepositAccountValue
          .plus(secondDepositAccountValue)
          .toString(),
        accounts: [
          {
            assetAmount: firstdepositAssetAmount,
            assetId: firstDepositAssetId,
            assetPrice: BITCOIN_PRICE.toString(),
            accountValue: firstDepositAccountValue.toString(),
          },
          {
            assetAmount: secondDepositAssetAmount,
            assetId: secondDepositAssetId,
            assetPrice: ETH_PRICE.toString(),
            accountValue: secondDepositAccountValue.toString(),
          },
        ],
      });

      expect(queueStub.publishEvent).toHaveBeenNthCalledWith(
        2,
        LEDGER_ACCOUNT_UPDATED_TOPIC,
        {
          userId: user.id,
          ledgerAccounts: [
            {
              assetId: secondDepositAssetId,
              assetAmount: secondDepositAssetAmount,
              assetPrice: ETH_PRICE.toString(),
              accountValue: secondDepositAccountValue.toString(),
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
});
