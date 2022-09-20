/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { clearDatabase, queueStub } from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { MarginCheck } from '../../../libs/api/margin-api/margin/src/lib/margin_check.entity';
import { MarginNotification } from '../../../libs/api/margin-api/margin/src/lib/margin_notifications.entity';
import { MarginCall } from '../../../libs/api/margin-api/margin/src/lib/margin_calls.entity';
import { MarginQueueController } from '../../../libs/api/margin-api/margin/src/lib/margin.controller';
import { LtvUpdatedPayload } from '../../../libs/api/ltv-api/data-transfer-objects/src';
import {
  LTV_LIMIT_APPROACHING_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '../../../libs/api/margin-api/constants/src';

describe('MarginQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let marginCallRepository: Repository<MarginCall>;
  let _marginCheckRepository: Repository<MarginCheck>;
  let _marginNotificationRepository: Repository<MarginNotification>;

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

    marginCallRepository = app.get(getRepositoryToken(MarginCall));
    _marginCheckRepository = app.get(getRepositoryToken(MarginCheck));
    _marginNotificationRepository = app.get(
      getRepositoryToken(MarginNotification),
    );
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('LTV_UPDATED flow', () => {
    it('Should start and liquidate straight away if ltv is above 90% and was never above 75% before', async () => {
      const payload: LtvUpdatedPayload = {
        userId,
        ltv: 90,
        calculatedOn: {
          collateral: [
            {
              asset: asset,
              price: 1000,
              amount: 1,
            },
          ],
          collateralBalance: 1000,
          utilizedCreditAmount: 900,
          calculatedAt: new Date().toISOString(),
        },
      };

      await app.get(MarginQueueController).ltvUpdatedHandler(payload);

      expect(queueStub.publish).toBeCalledTimes(2);
      expect(queueStub.publish).toBeCalledWith(MARGIN_CALL_STARTED_TOPIC, {
        collateralBalance: payload.calculatedOn.collateralBalance,
        ltv: payload.ltv,
        priceForMarginCall: 1200,
        priceForPartialCollateralSale: 1000,
        userId,
      });
      const expectedSale = 750;
      expect(queueStub.publish).toBeCalledWith(MARGIN_CALL_COMPLETED_TOPIC, {
        collateralBalance:
          payload.calculatedOn.collateralBalance - expectedSale,
        ltv: 60,
        priceForMarginCall: 200,
        priceForPartialCollateralSale: 166.66666666666666,
        userId,
        liquidation: [
          {
            amount: 0.75,
            asset,
            price: expectedSale,
          },
        ],
        liquidationAmount: expectedSale,
      });
    });

    it('Should deactivate active margin call if ltv goes under margin call limit (75%)', async () => {
      await marginCallRepository.insert({
        userId,
      });

      const payload: LtvUpdatedPayload = {
        userId,
        ltv: 70,
        calculatedOn: {
          collateral: [
            {
              asset: asset,
              price: 1000,
              amount: 1,
            },
          ],
          collateralBalance: 1000,
          utilizedCreditAmount: 700,
          calculatedAt: new Date().toISOString()
        },
      };

      await app.get(MarginQueueController).ltvUpdatedHandler(payload);

      expect(queueStub.publish).toBeCalledTimes(1);
      const expectedSale = 0;
      expect(queueStub.publish).toBeCalledWith(MARGIN_CALL_COMPLETED_TOPIC, {
        collateralBalance:
          payload.calculatedOn.collateralBalance - expectedSale,
        ltv: payload.ltv,
        priceForMarginCall: 933.3333333333334,
        priceForPartialCollateralSale: 777.7777777777777,
        userId,
        liquidation: [],
        liquidationAmount: expectedSale,
      });
    });

    it('Should send warning mail in case ltv goes above 65%', async () => {
      const payload: LtvUpdatedPayload = {
        userId,
        ltv: 65,
        calculatedOn: {
          collateral: [
            {
              asset: asset,
              price: 1000,
              amount: 1,
            },
          ],
          collateralBalance: 1000,
          utilizedCreditAmount: 650,
          calculatedAt: new Date().toISOString()
        },
      };

      await app.get(MarginQueueController).ltvUpdatedHandler(payload);

      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(LTV_LIMIT_APPROACHING_TOPIC, {
        collateralBalance: payload.calculatedOn.collateralBalance,
        ltv: payload.ltv,
        priceForMarginCall: 866.6666666666666,
        priceForPartialCollateralSale: 722.2222222222222,
        userId,
      });
    });
  });
});
