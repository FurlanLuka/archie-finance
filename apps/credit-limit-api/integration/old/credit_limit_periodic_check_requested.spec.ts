/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
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
} from './data/collateral.stubs';
import { BigNumber } from 'bignumber.js';
import { Collateral } from '@archie/api/credit-api/collateral';
import { CreditLimit } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/credit_limit.entity';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';
import { CREDIT_LIMIT_UPDATED_TOPIC } from '@archie/api/credit-limit-api/constants';
import { PeriodicCheckQueueController } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/periodic_check/periodic_check.controller';

describe('PeriodicCheckQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let collateralRepository: Repository<Collateral>;
  let creditLimitRepository: Repository<CreditLimit>;

  const userId = 'userId';
  const asset = 'ETH';

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

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);
    when(queueStub.request)
      .calledWith(GET_ASSET_INFORMATION_RPC)
      .mockResolvedValue(assetListResponse);
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED flow', () => {
    it.only('Should check credit limit for selected users', async () => {
      const startingEthAmount = '1';
      const currentCreditLimit = 100;
      await collateralRepository.insert({
        userId,
        asset,
        amount: startingEthAmount,
      });
      await creditLimitRepository.insert({
        userId,
        creditLimit: currentCreditLimit,
        calculatedOnCollateralBalance: 0,
        calculatedAt: new Date().toISOString(),
      });

      await app
        .get(PeriodicCheckQueueController)
        .creditLimitPeriodicCheckHandler({
          userIds: [userId],
        });

      const expectedNewCreditLimit = BigNumber(startingEthAmount)
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
  });
});
