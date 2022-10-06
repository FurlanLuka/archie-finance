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
import {
  LtvDto,
  LtvQueueController,
  LtvStatus,
  MarginCallsDto,
  MarginCallStatus,
} from '@archie/api/ltv-api/ltv';
import { ledgerAccountUpdatedPayloadFactory } from '@archie/api/ledger-api/test-data';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';
import { creditBalanceUpdatedFactory } from '@archie-microservices/api/peach-api/test-data';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import {
  COLLATERAL_SALE_LTV_LIMIT,
  LTV_MARGIN_CALL_LIMIT,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/ltv-api/constants';
import { MARGIN_CALL_LIQUIDATION_AFTER_HOURS } from '@archie/api/ltv-api/constants';
import { INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND } from '@archie/api/ledger-api/constants';
import { LedgerActionType } from '@archie/api/ledger-api/data-transfer-objects';
import { PaymentType } from '@archie/api/peach-api/data-transfer-objects';

describe('Ltv api tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Receive ledger value update', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(() => {
      queueStub.publish.mockReset();
    });

    const ledgerUpdatedPayload = ledgerAccountUpdatedPayloadFactory();
    const ledgerValue = ledgerUpdatedPayload.ledgerAccounts.reduce(
      (value, ledgerAcc) =>
        BigNumber(value).plus(ledgerAcc.accountValue).toNumber(),
      0,
    );
    const liquidationAmount = '15000';
    const afterLiquidationLtv = 60;
    let liquidationId: string;

    it(`should keep ltv at 0 as credit line was not created yet`, async () => {
      await app.get(LtvQueueController).ledgerUpdated(ledgerUpdatedPayload);
      const response = await request(app.getHttpServer())
        .get('/v1/ltv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<LtvDto>({
        ltv: 0,
        status: LtvStatus.good,
      });
    });

    it(`should keep ltv at 0 when the credit line is created`, async () => {
      const creditLineCreatedPayload = creditLineCreatedDataFactory();

      await app
        .get(LtvQueueController)
        .creditLineCreatedHandler(creditLineCreatedPayload);
      const response = await request(app.getHttpServer())
        .get('/v1/ltv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<LtvDto>({
        ltv: 0,
        status: LtvStatus.good,
      });
    });

    it(`should create margin call and liquidate once ltv reaches 90%`, async () => {
      const creditBalanceUpdatedPayload = creditBalanceUpdatedFactory({
        utilizationAmount: ledgerValue * 0.9,
      });

      await app
        .get(LtvQueueController)
        .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);
      const ltvResponse = await request(app.getHttpServer())
        .get('/v1/ltv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const marginCallResponse = await request(app.getHttpServer())
        .get('/v1/margin_calls')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(ltvResponse.body).toStrictEqual<LtvDto>({
        ltv: afterLiquidationLtv,
        status: LtvStatus.ok,
      });
      expect(marginCallResponse.body).toStrictEqual<MarginCallsDto[]>([
        {
          status: MarginCallStatus.active,
          automaticLiquidationAt: DateTime.fromISO(
            marginCallResponse.body[0].createdAt,
          )
            .plus({
              hour: MARGIN_CALL_LIQUIDATION_AFTER_HOURS,
            })
            .toUTC()
            .toString(),
          createdAt: expect.any(String),
        },
      ]);
      expect(queueStub.publish).nthCalledWith(1, MARGIN_CALL_STARTED_TOPIC, {
        userId: user.id,
        startedAt: expect.any(String),
        ltv: 90,
        priceForMarginCall:
          creditBalanceUpdatedPayload.utilizationAmount /
          (LTV_MARGIN_CALL_LIMIT / 100),
        priceForPartialCollateralSale:
          creditBalanceUpdatedPayload.utilizationAmount /
          (COLLATERAL_SALE_LTV_LIMIT / 100),
        collateralBalance: ledgerValue,
      });
      expect(queueStub.publish).nthCalledWith(
        2,
        INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
        {
          userId: user.id,
          amount: liquidationAmount,
          liquidationId: expect.any(String),
        },
      );
      liquidationId = queueStub.publish.mock.calls[1][1].liquidationId;
    });

    it(`should not mark margin call as completed if only collateral balance update is received`, async () => {
      const ledgerUpdatedDueToLiquidationEvent =
        ledgerAccountUpdatedPayloadFactory({
          action: {
            type: LedgerActionType.LIQUIDATION,
            liquidation: {
              id: liquidationId,
              usdAmount: liquidationAmount,
            },
          },
        });

      await app
        .get(LtvQueueController)
        .ledgerUpdated(ledgerUpdatedDueToLiquidationEvent);
      const marginCallResponse = await request(app.getHttpServer())
        .get('/v1/margin_calls')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(marginCallResponse.body[0].status).toStrictEqual(
        MarginCallStatus.active,
      );
    });

    it(`should mark margin call as completed after also credit balance update is received`, async () => {
      const creditUtilizationUpdatedDueToLiquidationEvent =
        creditBalanceUpdatedFactory({
          paymentDetails: {
            type: PaymentType.liquidation,
            id: liquidationId,
            amount: liquidationAmount,
            asset: 'USD',
          },
        });

      await app
        .get(LtvQueueController)
        .creditBalanceUpdatedHandler(
          creditUtilizationUpdatedDueToLiquidationEvent,
        );
      const marginCallResponse = await request(app.getHttpServer())
        .get('/v1/margin_calls')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(marginCallResponse.body[0].status).toStrictEqual(
        MarginCallStatus.completed,
      );
    });
  });
});
