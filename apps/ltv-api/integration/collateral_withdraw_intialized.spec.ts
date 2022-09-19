/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LtvCollateral } from '../../../libs/api/ltv-api/ltv/src/lib/collateral.entity';
import { clearDatabase, queueStub } from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { assetPriceResponse, ETH_PRICE } from './data/collateral.stubs';
import { CollateralQueueController } from '../../../libs/api/ltv-api/ltv/src/lib/collateral/collateral.controller';
import { LtvCredit } from '../../../libs/api/ltv-api/ltv/src/lib/credit.entity';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';

describe('CollateralQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let ltvCollateralRepository: Repository<LtvCollateral>;
  let ltvCreditRepository: Repository<LtvCredit>;

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

    ltvCollateralRepository = app.get(getRepositoryToken(LtvCollateral));
    ltvCreditRepository = app.get(getRepositoryToken(LtvCredit));

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);
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
      const utilizationAmount = 10;
      const startingEthAmount = 1;
      const withdrawalAmount = 0.3;
      await ltvCollateralRepository.insert({
        userId,
        asset,
        amount: startingEthAmount,
      });
      await ltvCreditRepository.insert({
        userId,
        utilizationAmount: utilizationAmount,
        calculatedAt: new Date().toISOString(),
      });

      await app
        .get(CollateralQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: 'withdrawalId',
        });

      const collateralBalance =
        ETH_PRICE * (startingEthAmount - withdrawalAmount);
      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(LTV_UPDATED_TOPIC, {
        userId,
        ltv: (utilizationAmount / collateralBalance) * 100,
        calculatedOn: {
          utilizedCreditAmount: utilizationAmount,
          collateralBalance: collateralBalance,
          collateral: [
            {
              amount: startingEthAmount - withdrawalAmount,
              asset,
              price: collateralBalance,
            },
          ],
        },
      });
    });
  });
});
