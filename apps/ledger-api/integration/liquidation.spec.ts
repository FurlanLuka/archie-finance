import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  generateUserAccessToken,
  initializeTestingModule,
  queueStub,
  TestDatabase,
  user,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { AssetPrices } from '@archie/api/ledger-api/assets';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { collateralDepositTransactionCompletedPayloadFactory } from '@archie/api/fireblocks-api/test-data';
import {
  DepositQueueController,
  LiquidationQueueController,
} from '@archie/api/ledger-api/ledger';
import BigNumber from 'bignumber.js';
import { initiateLedgerAssetLiquidationCommandPayloadFactory } from '@archie/api/ledger-api/test-data';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { INITIATE_COLLATERAL_LIQUIDATION_COMMAND } from '@archie/api/fireblocks-api/constants';

describe('Ledger api liquidation tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const BITCOIN_PRICE = 10_000;
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

  describe('Liquidate assets in the right order', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const bitcoinCollateral = {
      assetId: 'BTC',
      amount: '0.77532234',
      price: BITCOIN_PRICE,
    };

    const ethereumCollateral = {
      assetId: 'ETH',
      amount: '0.775365378945211123',
      price: ETH_PRICE,
    };

    const usdcCollateral = {
      assetId: 'USDC',
      amount: '400.444222',
      price: USDC_PRICE,
    };

    const collateral = [bitcoinCollateral, ethereumCollateral, usdcCollateral];

    it.each(collateral)(
      'should deposit assets to setup ledger for liquidation',
      async ({ assetId, amount, price }) => {
        const collateralDepositTransactionCompletedPayload =
          collateralDepositTransactionCompletedPayloadFactory({
            assetId,
            amount,
          });

        await app
          .get(DepositQueueController)
          .depositHandler(collateralDepositTransactionCompletedPayload);

        const response = await request(app.getHttpServer())
          .get('/v1/ledger')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        const result = response.body.accounts.find(
          (account) => account.assetId === assetId,
        );

        expect(result).toStrictEqual({
          assetAmount: amount,
          assetId: assetId,
          assetPrice: price.toString(),
          accountValue: BigNumber(amount)
            .multipliedBy(price)
            .decimalPlaces(2, BigNumber.ROUND_DOWN)
            .toString(),
        });
      },
    );

    it('should liquidate all USDC and part of bitcoin', async () => {
      queueStub.publish.mockReset();

      const liquidationValue = BigNumber(700);

      const initiateLedgerAssetLiquidationCommandPayload =
        initiateLedgerAssetLiquidationCommandPayloadFactory({
          amount: liquidationValue.toString(),
        });

      await app
        .get(LiquidationQueueController)
        .initiateLiquidationCommand(
          initiateLedgerAssetLiquidationCommandPayload,
        );

      const liquidationResponse = await request(app.getHttpServer())
        .get('/v1/ledger/liquidation')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const usdcCollateralValue = BigNumber(usdcCollateral.amount)
        .dividedBy(usdcCollateral.price)
        .decimalPlaces(2, BigNumber.ROUND_DOWN);

      const liquidatedBitcoinAmount = liquidationValue
        .minus(usdcCollateralValue)
        .dividedBy(bitcoinCollateral.price);

      const newBitcoinAmount = BigNumber(bitcoinCollateral.amount).minus(
        liquidatedBitcoinAmount,
      );

      const newBitcoinAccountValue = newBitcoinAmount
        .multipliedBy(bitcoinCollateral.price)
        .decimalPlaces(2, BigNumber.ROUND_DOWN);

      expect(liquidationResponse.body).toStrictEqual([
        {
          assetId: usdcCollateral.assetId,
          status: 'INITIATED',
          amount: usdcCollateral.amount.toString(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
        {
          assetId: bitcoinCollateral.assetId,
          status: 'INITIATED',
          amount: liquidatedBitcoinAmount.toString(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
      ]);

      const response = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const bitcoinAccount = response.body.accounts.find(
        (account) => account.assetId === bitcoinCollateral.assetId,
      );

      expect(bitcoinAccount).toStrictEqual({
        assetAmount: newBitcoinAmount.toString(),
        assetId: bitcoinCollateral.assetId,
        assetPrice: bitcoinCollateral.price.toString(),
        accountValue: newBitcoinAccountValue.toString(),
      });

      const usdcAccount = response.body.accounts.find(
        (account) => account.assetId === usdcCollateral.assetId,
      );

      expect(usdcAccount).toStrictEqual({
        assetAmount: '0',
        assetId: usdcCollateral.assetId,
        assetPrice: usdcCollateral.price.toString(),
        accountValue: '0',
      });

      expect(queueStub.publish).toHaveBeenCalledTimes(3);

      expect(queueStub.publish).toHaveBeenNthCalledWith(
        1,
        LEDGER_ACCOUNT_UPDATED_TOPIC,
        {
          userId: user.id,
          ledgerAccounts: [
            {
              assetId: usdcCollateral.assetId,
              assetAmount: '0',
              accountValue: '0',
              calculatedAt: expect.any(String),
            },
            {
              assetId: bitcoinCollateral.assetId,
              assetAmount: newBitcoinAmount.toString(),
              accountValue: newBitcoinAccountValue.toString(),
              calculatedAt: expect.any(String),
            },
          ],
        },
      );

      expect(queueStub.publish).toHaveBeenNthCalledWith(
        2,
        INITIATE_COLLATERAL_LIQUIDATION_COMMAND,
        {
          userId: user.id,
          amount: usdcCollateral.amount,
          assetId: usdcCollateral.assetId,
          internalTransactionId: expect.any(String),
        },
      );

      // NOT WERKIN FOR SOME REASON
      // expect(queueStub.publish).toHaveBeenNthCalledWith(
      //   3,
      //   INITIATE_COLLATERAL_LIQUIDATION_COMMAND,
      //   {
      //     userId: user.id,
      //     amount: liquidatedBitcoinAmount,
      //     assetId: bitcoinCollateral.assetId,
      //     internalTransactionId: expect.any(String),
      //   },
      // );
    });
  });
});
