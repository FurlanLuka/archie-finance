/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LtvCollateral } from '../../../../libs/api/ltv-api/ltv/src/lib/collateral.entity';
import {
  clearDatabase,
  equalToBigNumber,
  queueStub,
} from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { assetPriceResponse, ETH_PRICE } from '../test-data/collateral.stubs';
import { LtvCredit } from '../../../../libs/api/ltv-api/ltv/src/lib/credit.entity';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';
import { CreditQueueController } from '../../../../libs/api/ltv-api/ltv/src/lib/credit/credit.controller';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects';
import { BigNumber } from 'bignumber.js';

describe('CreditQueueController (e2e)', () => {
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

  describe('CREDIT_BALANCE_UPDATED flow', () => {
    it('Should publish ltv updated event if credit utilization amount changes', async () => {
      const startingEthAmount = '1';
      await ltvCollateralRepository.insert({
        userId,
        asset,
        amount: startingEthAmount,
      });
      const paymentAmount = '0.3';
      await ltvCreditRepository.insert({
        userId,
        utilizationAmount: 5,
        calculatedAt: new Date().toISOString(),
      });
      const balanceUpdatedPayload: CreditBalanceUpdatedPayload = {
        userId,
        availableCreditAmount: 100,
        creditLimitAmount: 90,
        utilizationAmount: 10,
        calculatedAt: new Date().toISOString(),
        paymentDetails: {
          type: PaymentType.liquidation,
          asset: 'ETH',
          amount: paymentAmount,
          id: 'id',
        },
      };

      await app
        .get(CreditQueueController)
        .creditBalanceUpdatedHandler(balanceUpdatedPayload);

      const collateralAmount = BigNumber(startingEthAmount).minus(
        BigNumber(paymentAmount),
      );
      const collateralBalance = collateralAmount
        .multipliedBy(ETH_PRICE)
        .toNumber();
      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(LTV_UPDATED_TOPIC, {
        userId,
        ltv:
          (balanceUpdatedPayload.utilizationAmount / collateralBalance) * 100,
        calculatedOn: {
          utilizedCreditAmount: balanceUpdatedPayload.utilizationAmount,
          collateralBalance: collateralBalance,
          collateral: [
            {
              amount: equalToBigNumber(collateralAmount),
              asset,
              price: collateralBalance,
            },
          ],
          calculatedAt: expect.any(String),
        },
      });
    });
  });
});
