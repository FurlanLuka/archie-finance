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
import {
  ledgerAccountDataFactory,
  ledgerAccountUpdatedPayloadFactory,
} from '@archie/api/ledger-api/test-data';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';
import { creditBalanceUpdatedFactory } from '@archie-microservices/api/peach-api/test-data';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import {
  COLLATERAL_SALE_LTV_LIMIT,
  LTV_MARGIN_CALL_LIMIT,
  LTV_UPDATED_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/ltv-api/constants';
import { MARGIN_CALL_LIQUIDATION_AFTER_HOURS } from '@archie/api/ltv-api/constants';
import { INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND } from '@archie/api/ledger-api/constants';
import { LedgerActionType } from '@archie/api/ledger-api/data-transfer-objects';
import { PaymentType } from '@archie/api/peach-api/data-transfer-objects';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarginCall } from '@archie/api/ltv-api/ltv';

describe('Ltv api tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;
  let marginCallRepository: Repository<MarginCall>;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();
    marginCallRepository = app.get(getRepositoryToken(MarginCall));
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Receive ledger value update', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(() => {
      queueStub.publishEvent.mockReset();
    });

    const ledgerUpdatedPayload = ledgerAccountUpdatedPayloadFactory();
    let ledgerValue = ledgerUpdatedPayload.ledgerAccounts.reduce(
      (value, ledgerAcc) =>
        BigNumber(value).plus(ledgerAcc.accountValue).toNumber(),
      0,
    );
    let liquidationAmount = '15000';
    const afterLiquidationLtv = 60;
    let creditUtilizationAmount = 0;

    it(`should keep ltv at 0 as credit line was not created yet`, async () => {
      await app.get(LtvQueueController).ledgerUpdated(ledgerUpdatedPayload);
      const response = await request(app.getHttpServer())
        .get('/v1/ltv')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(queueStub.publishEvent).toHaveBeenCalledWith(LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv: 0,
      });
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

    it(`should send ltv margin notification once ltv reaches 65%`, async () => {
      const targetLtv = 65;
      creditUtilizationAmount = ledgerValue * (targetLtv / 100);
      const creditBalanceUpdatedPayload = creditBalanceUpdatedFactory({
        utilizationAmount: creditUtilizationAmount,
      });

      await app
        .get(LtvQueueController)
        .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);

      expect(queueStub.publishEvent).toBeCalledTimes(2);
      expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv: targetLtv,
      });
      expect(queueStub.publishEvent).nthCalledWith(
        2,
        MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC,
        {
          userId: user.id,
          ltv: targetLtv,
          priceForMarginCall:
            creditUtilizationAmount / (LTV_MARGIN_CALL_LIMIT / 100),
          priceForPartialCollateralSale:
            creditUtilizationAmount / (COLLATERAL_SALE_LTV_LIMIT / 100),
          collateralBalance: ledgerValue,
        },
      );
    });

    it(`should send ltv margin notification once collateral value falls for another 10%`, async () => {
      const newLedgerValue = ledgerValue - 0.1 * ledgerValue;
      const ltv = (creditUtilizationAmount / newLedgerValue) * 100;

      await app.get(LtvQueueController).ledgerUpdated(
        ledgerAccountUpdatedPayloadFactory({
          ledgerAccounts: [
            ledgerAccountDataFactory({
              accountValue: newLedgerValue.toString(),
            }),
          ],
        }),
      );

      expect(queueStub.publishEvent).toBeCalledTimes(2);
      expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv,
      });
      expect(queueStub.publishEvent).nthCalledWith(
        2,
        MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC,
        {
          userId: user.id,
          ltv,
          priceForMarginCall:
            creditUtilizationAmount / (LTV_MARGIN_CALL_LIMIT / 100),
          priceForPartialCollateralSale:
            creditUtilizationAmount / (COLLATERAL_SALE_LTV_LIMIT / 100),
          collateralBalance: newLedgerValue,
        },
      );
    });

    it(`should reset ledger value`, async () => {
      await app
        .get(LtvQueueController)
        .ledgerUpdated(ledgerAccountUpdatedPayloadFactory());

      expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv: (creditUtilizationAmount / ledgerValue) * 100,
      });
    });

    it(`should start margin call once ltv reaches 75%`, async () => {
      const targetLtv = 75;
      creditUtilizationAmount = ledgerValue * (targetLtv / 100);
      const creditBalanceUpdatedPayload = creditBalanceUpdatedFactory({
        utilizationAmount: creditUtilizationAmount,
      });

      await app
        .get(LtvQueueController)
        .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);

      expect(queueStub.publishEvent).toBeCalledTimes(2);
      expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv: targetLtv,
      });
      expect(queueStub.publishEvent).nthCalledWith(
        2,
        MARGIN_CALL_STARTED_TOPIC,
        {
          userId: user.id,
          startedAt: expect.any(String),
          ltv: targetLtv,
          priceForMarginCall:
            creditBalanceUpdatedPayload.utilizationAmount /
            (LTV_MARGIN_CALL_LIMIT / 100),
          priceForPartialCollateralSale:
            creditBalanceUpdatedPayload.utilizationAmount /
            (COLLATERAL_SALE_LTV_LIMIT / 100),
          collateralBalance: ledgerValue,
        },
      );
    });

    it(`should complete margin call without liquidation if ltv falls bellow 75% in the 72h grace period`, async () => {
      const targetLtv = 74;
      creditUtilizationAmount = ledgerValue * (targetLtv / 100);
      const creditBalanceUpdatedPayload = creditBalanceUpdatedFactory({
        utilizationAmount: creditUtilizationAmount,
      });

      await app
        .get(LtvQueueController)
        .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);

      expect(queueStub.publishEvent).toBeCalledTimes(2);
      expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv: targetLtv,
      });
      expect(queueStub.publishEvent).nthCalledWith(
        2,
        MARGIN_CALL_COMPLETED_TOPIC,
        {
          userId: user.id,
          ltv: targetLtv,
          completedAt: expect.any(String),
          liquidationAmount: 0,
          priceForMarginCall:
            creditBalanceUpdatedPayload.utilizationAmount /
            (LTV_MARGIN_CALL_LIMIT / 100),
          priceForPartialCollateralSale:
            creditBalanceUpdatedPayload.utilizationAmount /
            (COLLATERAL_SALE_LTV_LIMIT / 100),
          collateralBalance: ledgerValue,
        },
      );
    });

    describe('Liquidation in case ltv is above 75% for 72 hours', () => {
      let liquidationId: string | undefined;

      it(`should liquidate`, async () => {
        const expectedLiquidationCommandPublishSequence = 2;
        const targetLtv = 75;
        const expectedLiquidation = '7500';
        creditUtilizationAmount = ledgerValue * (targetLtv / 100);
        const creditBalanceUpdatedPayload = creditBalanceUpdatedFactory({
          utilizationAmount: creditUtilizationAmount,
        });
        const marginCallEnter72HoursAgo = DateTime.utc().minus({
          hour: 72,
        });

        await app
          .get(LtvQueueController)
          .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);
        queueStub.publishEvent.mockReset();
        await marginCallRepository.update(
          { userId: user.id },
          {
            createdAt: marginCallEnter72HoursAgo,
          },
        );
        await app
          .get(LtvQueueController)
          .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);

        expect(queueStub.publishEvent).toBeCalledTimes(2);
        expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
          userId: user.id,
          ltv: targetLtv,
        });
        expect(queueStub.publishEvent).nthCalledWith(
          expectedLiquidationCommandPublishSequence,
          INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
          {
            userId: user.id,
            amount: expectedLiquidation,
            liquidationId: expect.any(String),
          },
        );
        liquidationId =
          queueStub.publishEvent.mock.calls[
            expectedLiquidationCommandPublishSequence - 1
          ][1].liquidationId;
      });

      it(`should not mark margin call as completed if only collateral balance update is received`, async () => {
        if (liquidationId === undefined) {
          throw new Error('Liquidation id is not found');
        }
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
          .query({
            status: MarginCallStatus.active,
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(marginCallResponse.body[0].status).toEqual(
          MarginCallStatus.active,
        );
      });

      it(`should mark margin call as completed after also credit balance update is received`, async () => {
        if (liquidationId === undefined) {
          throw new Error('Liquidation id is not found');
        }
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

        const activeMarginCalls = marginCallResponse.body.filter(
          (marginCall) => marginCall.status === MarginCallStatus.active,
        );
        expect(marginCallResponse.body.length > 0).toEqual(true);
        expect(activeMarginCalls).toHaveLength(0);
      });
    });

    describe('Liquidation in case ltv reaches 90%', () => {
      let liquidationId: string | undefined;

      it(`should create margin call and liquidate once ltv reaches 90%`, async () => {
        const targetLtv = 90;
        const expectedLiquidationCommandPublishSequence = 3;
        const creditBalanceUpdatedPayload = creditBalanceUpdatedFactory({
          utilizationAmount: ledgerValue * (targetLtv / 100),
        });

        await app
          .get(LtvQueueController)
          .ledgerUpdated(ledgerAccountUpdatedPayloadFactory());
        queueStub.publishEvent.mockReset();
        await app
          .get(LtvQueueController)
          .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);
        const ltvResponse = await request(app.getHttpServer())
          .get('/v1/ltv')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
        const marginCallResponse = await request(app.getHttpServer())
          .get('/v1/margin_calls')
          .query({
            status: MarginCallStatus.active,
          })
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
        expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
          userId: user.id,
          ltv: targetLtv,
        });
        expect(queueStub.publishEvent).nthCalledWith(
          2,
          MARGIN_CALL_STARTED_TOPIC,
          {
            userId: user.id,
            startedAt: expect.any(String),
            ltv: targetLtv,
            priceForMarginCall:
              creditBalanceUpdatedPayload.utilizationAmount /
              (LTV_MARGIN_CALL_LIMIT / 100),
            priceForPartialCollateralSale:
              creditBalanceUpdatedPayload.utilizationAmount /
              (COLLATERAL_SALE_LTV_LIMIT / 100),
            collateralBalance: ledgerValue,
          },
        );
        expect(queueStub.publishEvent).nthCalledWith(
          expectedLiquidationCommandPublishSequence,
          INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
          {
            userId: user.id,
            amount: liquidationAmount,
            liquidationId: expect.any(String),
          },
        );
        liquidationId =
          queueStub.publishEvent.mock.calls[
            expectedLiquidationCommandPublishSequence - 1
          ][1].liquidationId;
      });

      it(`should not mark margin call as completed if only collateral balance update is received`, async () => {
        if (liquidationId === undefined) {
          throw new Error('Liquidation id is not found');
        }
        const ledgerUpdatedDueToLiquidationEvent =
          ledgerAccountUpdatedPayloadFactory({
            ledgerAccounts: [
              ledgerAccountDataFactory({
                accountValue: BigNumber(ledgerValue)
                  .minus(liquidationAmount)
                  .toString(),
              }),
            ],
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
          .query({
            status: MarginCallStatus.active,
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(marginCallResponse.body[0].status).toEqual(
          MarginCallStatus.active,
        );
      });

      it(`should mark margin call as completed after also credit balance update is received`, async () => {
        if (liquidationId === undefined) {
          throw new Error('Liquidation id is not found');
        }
        creditUtilizationAmount =
          creditUtilizationAmount - Number(liquidationAmount);
        const creditUtilizationUpdatedDueToLiquidationEvent =
          creditBalanceUpdatedFactory({
            utilizationAmount: creditUtilizationAmount,
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

        ledgerValue = ledgerValue - Number(liquidationAmount);
        expect(queueStub.publishEvent).toHaveBeenCalledWith(
          MARGIN_CALL_COMPLETED_TOPIC,
          {
            userId: user.id,
            ltv: creditUtilizationAmount / ledgerValue,
            completedAt: expect.any(String),
            liquidationAmount: Number(liquidationAmount),
            priceForMarginCall:
              creditUtilizationAmount / (LTV_MARGIN_CALL_LIMIT / 100),
            priceForPartialCollateralSale:
              creditUtilizationAmount / (COLLATERAL_SALE_LTV_LIMIT / 100),
            collateralBalance: ledgerValue,
          },
        );
        expect(marginCallResponse.body[0].status).toStrictEqual(
          MarginCallStatus.completed,
        );
      });
    });
  });
});
