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
} from '../test-data/collateral.stubs';
import { Collateral } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/collateral.entity';
import { CreditLimit } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/credit_limit.entity';
import { CreditLimitQueueController } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/credit_limit.controller';
import { CREDIT_LIMIT_INCREASED_TOPIC } from '../../../../libs/api/credit-limit-api/constants/src';
import { GET_ASSET_INFORMATION_RPC } from '../../../../libs/api/collateral-api/constants/src';

describe('CreditLimitQueueController (e2e)', () => {
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

  describe.skip('COLLATERAL_WITHDRAW_INITIALIZED flow', () => {
    it('Should publish CREDIT_LIMIT_INCREASED in case the credit limit is increased and collateral value changes by at least 10%', async () => {
      const startingEthAmount = 1;
      const withdrawalAmount = 0.3;
      const currentCreditLimit = 100;
      await collateralRepository.insert({
        userId,
        asset,
        amount: startingEthAmount,
      });
      await creditLimitRepository.insert({
        userId,
        creditLimit: currentCreditLimit,
        previousCreditLimit: currentCreditLimit,
        calculatedOnCollateralBalance: 0,
        calculatedAt: new Date().toISOString(),
      });

      await app
        .get(CreditLimitQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: 'withdrawalId',
        });

      const expectedNewCreditLimit =
        (ETH_PRICE *
          (startingEthAmount - withdrawalAmount) *
          assetListResponse[asset]!.ltv) /
        100;
      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(CREDIT_LIMIT_INCREASED_TOPIC, {
        amount: expectedNewCreditLimit - currentCreditLimit,
        calculatedAt: expect.any(Date),
        creditLimit: expectedNewCreditLimit,
        userId,
      });
    });
  });
});
