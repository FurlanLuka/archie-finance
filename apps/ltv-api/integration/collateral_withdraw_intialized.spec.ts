/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  clearDatabase,
  equalToBigNumber,
  queueStub,
} from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { when } from 'jest-when';
import { BigNumber } from 'bignumber.js';
import { LtvCollateral } from '../../../libs/api/ltv-api/ltv/src/lib/collateral.entity';
import { LtvCredit } from '../../../libs/api/ltv-api/ltv/src/lib/credit.entity';
import { CollateralTransaction } from '../../../libs/api/ltv-api/ltv/src/lib/collateral_transactions.entity';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { assetPriceResponse, ETH_PRICE } from './data/collateral.stubs';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';
import { CollateralQueueController } from '../../../libs/api/ltv-api/ltv/src/lib/collateral/collateral.controller';

describe('CollateralQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let ltvCollateralRepository: Repository<LtvCollateral>;
  let ltvCreditRepository: Repository<LtvCredit>;
  let collateralTransactionRepository: Repository<CollateralTransaction>;

  const userId = 'userId';
  const asset = 'ETH';
  const utilizationAmount = 10;
  const startingAssetAmount = '1';
  const withdrawalAmount = '0.3';
  const transactionId = 'transactionId';

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueService)
      .useValue(queueStub)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    ltvCollateralRepository = app.get(getRepositoryToken(LtvCollateral));
    ltvCreditRepository = app.get(getRepositoryToken(LtvCredit));
    collateralTransactionRepository = app.get(
      getRepositoryToken(CollateralTransaction),
    );

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);

    await ltvCollateralRepository.insert({
      userId,
      asset,
      amount: startingAssetAmount,
    });
    await ltvCreditRepository.insert({
      userId,
      utilizationAmount: utilizationAmount,
      calculatedAt: new Date().toISOString(),
    });
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('COLLATERAL_WITHDRAW_INITIALIZED flow', () => {
    it('Should publish ltv updated event if collateral has been withdrawn', async () => {
      await app
        .get(CollateralQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: transactionId,
        });

      const newCollateralAmount = BigNumber(startingAssetAmount).minus(
        BigNumber(withdrawalAmount),
      );
      const collateralBalance = newCollateralAmount
        .multipliedBy(ETH_PRICE)
        .toNumber();
      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(LTV_UPDATED_TOPIC, {
        userId,
        ltv: (utilizationAmount / collateralBalance) * 100,
        calculatedOn: {
          utilizedCreditAmount: utilizationAmount,
          collateralBalance: collateralBalance,
          collateral: [
            {
              amount: equalToBigNumber(newCollateralAmount),
              asset,
              price: collateralBalance,
            },
          ],
          calculatedAt: expect.any(String),
        },
      });
    });

    it('Should not publish event in case same transaction was already handled', async () => {
      await collateralTransactionRepository.insert({
        externalTransactionId: transactionId,
      });

      await app
        .get(CollateralQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: transactionId,
        });

      expect(queueStub.publish).toBeCalledTimes(0);
      const ethCollateral: LtvCollateral[] =
        await ltvCollateralRepository.findBy({
          userId,
          asset,
          amount: startingAssetAmount,
        });
      expect(ethCollateral).toHaveLength(1);
    });
  });
});
