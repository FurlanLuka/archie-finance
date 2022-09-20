/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { clearDatabase, queueStub } from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import {
  assetListResponse,
  assetPriceResponse,
  ETH_PRICE,
} from '../test-data/collateral.stubs';
import { Collateral } from '../../../../api/credit-limit-api/credit-limit/src/lib/collateral.entity';
import { CreditLimit } from '../../../../api/credit-limit-api/credit-limit/src/lib/credit_limit.entity';
import { CreditLimitQueueController } from '../../../../api/credit-limit-api/credit-limit/src/lib/credit_limit.controller';
import { CREDIT_LIMIT_UPDATED_TOPIC } from '../../../../api/credit-limit-api/constants/src';
import { GET_ASSET_INFORMATION_RPC } from '../../../../api/collateral-api/constants/src';
import { CollateralTransaction } from '../../../../api/credit-limit-api/credit-limit/src/lib/collateral_transactions.entity';
import { BigNumber } from 'bignumber.js';

describe('CreditLimitQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let collateralRepository: Repository<Collateral>;
  let creditLimitRepository: Repository<CreditLimit>;
  let collateralTransactionRepository: Repository<CollateralTransaction>;

  const userId = 'userId';
  const asset = 'ETH';

  const startingAssetAmount = '1';
  const withdrawalAmount = '0.3';
  const currentCreditLimit = 100;
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

    collateralRepository = app.get(getRepositoryToken(Collateral));
    creditLimitRepository = app.get(getRepositoryToken(CreditLimit));
    collateralTransactionRepository = app.get(
      getRepositoryToken(CollateralTransaction),
    );

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);
    when(queueStub.request)
      .calledWith(GET_ASSET_INFORMATION_RPC)
      .mockResolvedValue(assetListResponse);

    await collateralRepository.insert({
      userId,
      asset,
      amount: startingAssetAmount,
    });
    await creditLimitRepository.insert({
      userId,
      creditLimit: currentCreditLimit,
      calculatedOnCollateralBalance: 0,
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
    it('Should publish CREDIT_LIMIT_INCREASED in case the credit limit is increased and collateral value changes by at least 10%', async () => {
      await app
        .get(CreditLimitQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: 'withdrawalId',
        });

      const expectedNewCreditLimit = BigNumber(startingAssetAmount)
        .minus(BigNumber(withdrawalAmount))
        .multipliedBy(ETH_PRICE)
        .multipliedBy(assetListResponse[asset]!.ltv)
        .dividedBy(100)
        .toNumber();

      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(CREDIT_LIMIT_UPDATED_TOPIC, {
        calculatedAt: expect.any(Date),
        creditLimit: expectedNewCreditLimit,
        userId,
      });
    });

    it('Should not publish CREDIT_LIMIT_INCREASED or update collateral record in case the transaction was already handled', async () => {
      await collateralTransactionRepository.insert({
        externalTransactionId: transactionId,
      });

      await app
        .get(CreditLimitQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: transactionId,
        });

      expect(queueStub.publish).toBeCalledTimes(0);
      const collateralRecords: Collateral[] = await collateralRepository.findBy(
        {
          userId,
          asset,
          amount: startingAssetAmount,
        },
      );
      expect(collateralRecords).toHaveLength(1);
    });
  });
});
