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
import { LtvQueueController } from '@archie/api/ltv-api/ltv';
import { MarginCallDto } from '@archie/api/ltv-api/data-transfer-objects';

import { MarginCallStatus } from '@archie/api/ltv-api/data-transfer-objects/types';

import { LtvDto } from '@archie/api/ltv-api/data-transfer-objects';
import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import {
  ledgerAccountDataFactory,
  ledgerAccountUpdatedPayloadFactory,
} from '@archie/api/ledger-api/test-data';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';
import { creditBalanceUpdatedFactory } from '@archie/api/peach-api/test-data';
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
import {
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects/types';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarginCall, MarginPrices } from '@archie/api/ltv-api/ltv';

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

    function calculateLedgerValue(ledger: LedgerAccountUpdatedPayload): number {
      return ledger.ledgerAccounts.reduce(
        (value, ledgerAcc) =>
          BigNumber(value).plus(ledgerAcc.accountValue).toNumber(),
        0,
      );
    }

    const ledgerUpdatedPayload = ledgerAccountUpdatedPayloadFactory();
    let ledgerValue = calculateLedgerValue(ledgerUpdatedPayload);
    const afterLiquidationLtv = 60;
    let creditUtilizationAmount = 0;

    function calculateCreditUtilizationForLtv(
      targetLtv: number,
    ): CreditBalanceUpdatedPayload {
      creditUtilizationAmount = ledgerValue * (targetLtv / 100);
      return creditBalanceUpdatedFactory({
        utilizationAmount: creditUtilizationAmount,
      });
    }

    function getMarginPrices(): MarginPrices {
      return {
        priceForMarginCall:
          creditUtilizationAmount / (LTV_MARGIN_CALL_LIMIT / 100),
        priceForPartialCollateralSale:
          creditUtilizationAmount / (COLLATERAL_SALE_LTV_LIMIT / 100),
        collateralBalance: ledgerValue,
      };
    }

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
      const creditBalanceUpdatedPayload =
        calculateCreditUtilizationForLtv(targetLtv);

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
          ...getMarginPrices(),
        },
      );
    });

    it(`should send ltv margin notification once collateral value falls for another 10%`, async () => {
      ledgerValue = ledgerValue - 0.1 * ledgerValue;
      const ltv = (creditUtilizationAmount / ledgerValue) * 100;

      await app.get(LtvQueueController).ledgerUpdated(
        ledgerAccountUpdatedPayloadFactory({
          ledgerAccounts: [
            ledgerAccountDataFactory({
              accountValue: ledgerValue.toString(),
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
          ...getMarginPrices(),
        },
      );
    });

    it(`should reset ledger value`, async () => {
      const ledgerAccountUpdatedPayload = ledgerAccountUpdatedPayloadFactory();
      ledgerValue = calculateLedgerValue(ledgerAccountUpdatedPayload);

      await app
        .get(LtvQueueController)
        .ledgerUpdated(ledgerAccountUpdatedPayload);

      expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
        userId: user.id,
        ltv: (creditUtilizationAmount / ledgerValue) * 100,
      });
    });

    it(`should start margin call once ltv reaches 75%`, async () => {
      const targetLtv = 75;
      const creditBalanceUpdatedPayload =
        calculateCreditUtilizationForLtv(targetLtv);

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
          ...getMarginPrices(),
        },
      );
    });

    it(`should complete margin call without liquidation if ltv falls bellow 75% in the 72h grace period`, async () => {
      const targetLtv = 74;
      const creditBalanceUpdatedPayload =
        calculateCreditUtilizationForLtv(targetLtv);

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
          ...getMarginPrices(),
        },
      );
    });

    describe('Liquidation in case ltv is above 75% for 72 hours', () => {
      let liquidationId: string | undefined;
      const expectedLiquidationAmount = '7500';

      it(`should start margin call with liquidation date in the past`, async () => {
        const targetLtv = 75;
        const creditBalanceUpdatedPayload =
          calculateCreditUtilizationForLtv(targetLtv);
        const marginCallEnter72HoursAgo = DateTime.utc().minus({
          hour: 72,
        });

        await app
          .get(LtvQueueController)
          .creditBalanceUpdatedHandler(creditBalanceUpdatedPayload);
        await marginCallRepository.update(
          { userId: user.id },
          {
            createdAt: marginCallEnter72HoursAgo,
          },
        );
        const marginCallResponse = await request(app.getHttpServer())
          .get('/v1/margin_calls')
          .query({
            status: MarginCallStatus.active,
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(
          DateTime.fromISO(marginCallResponse.body[0].automaticLiquidationAt) <
            DateTime.now(),
        ).toEqual(true);
      });

      it(`should liquidate if margin call is active for 72 hours straight`, async () => {
        const expectedLiquidationCommandPublishSequence = 2;
        const targetLtv = 75;
        const expectedLiquidation = '7500';
        const creditBalanceUpdatedPayload =
          calculateCreditUtilizationForLtv(targetLtv);

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
        ledgerValue = BigNumber(ledgerValue)
          .minus(expectedLiquidationAmount)
          .toNumber();
        const ledgerUpdatedDueToLiquidationEvent =
          ledgerAccountUpdatedPayloadFactory({
            ledgerAccounts: [
              ledgerAccountDataFactory({
                accountValue: ledgerValue.toString(),
              }),
            ],
            action: {
              type: LedgerActionType.LIQUIDATION,
              liquidation: {
                id: liquidationId,
                usdAmount: expectedLiquidationAmount,
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
          creditUtilizationAmount - Number(expectedLiquidationAmount);
        const creditUtilizationUpdatedDueToLiquidationEvent =
          creditBalanceUpdatedFactory({
            utilizationAmount: creditUtilizationAmount,
            paymentDetails: {
              type: PaymentType.liquidation,
              id: liquidationId,
              amount: expectedLiquidationAmount,
              asset: 'USD',
            },
          });

        await app
          .get(LtvQueueController)
          .creditBalanceUpdatedHandler(
            creditUtilizationUpdatedDueToLiquidationEvent,
          );
        const activeMarginCalls = await request(app.getHttpServer())
          .get('/v1/margin_calls')
          .query({
            status: MarginCallStatus.active,
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(activeMarginCalls.body).toHaveLength(0);
        expect(queueStub.publishEvent).toHaveBeenCalledWith(
          MARGIN_CALL_COMPLETED_TOPIC,
          {
            userId: user.id,
            ltv: (creditUtilizationAmount / ledgerValue) * 100,
            completedAt: expect.any(String),
            liquidationAmount: Number(expectedLiquidationAmount),
            ...getMarginPrices(),
          },
        );
      });
    });

    describe('Liquidation in case ltv reaches 90%', () => {
      let liquidationId: string | undefined;
      const expectedLiquidationAmount = '15000';

      it(`should reset ledger value`, async () => {
        const ledgerAccountUpdatedPayload =
          ledgerAccountUpdatedPayloadFactory();
        ledgerValue = calculateLedgerValue(ledgerAccountUpdatedPayload);

        await app
          .get(LtvQueueController)
          .ledgerUpdated(ledgerAccountUpdatedPayload);

        expect(queueStub.publishEvent).nthCalledWith(1, LTV_UPDATED_TOPIC, {
          userId: user.id,
          ltv: (creditUtilizationAmount / ledgerValue) * 100,
        });
      });

      it(`should create margin call and liquidate once ltv reaches 90%`, async () => {
        const targetLtv = 90;
        const expectedLiquidationCommandPublishSequence = 3;
        const creditBalanceUpdatedPayload =
          calculateCreditUtilizationForLtv(targetLtv);

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
        expect(marginCallResponse.body).toStrictEqual<MarginCallDto[]>([
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
            ...getMarginPrices(),
          },
        );
        expect(queueStub.publishEvent).nthCalledWith(
          expectedLiquidationCommandPublishSequence,
          INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND,
          {
            userId: user.id,
            amount: expectedLiquidationAmount,
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
        ledgerValue = BigNumber(ledgerValue)
          .minus(expectedLiquidationAmount)
          .toNumber();
        const ledgerUpdatedDueToLiquidationEvent =
          ledgerAccountUpdatedPayloadFactory({
            ledgerAccounts: [
              ledgerAccountDataFactory({
                accountValue: ledgerValue.toString(),
              }),
            ],
            action: {
              type: LedgerActionType.LIQUIDATION,
              liquidation: {
                id: liquidationId,
                usdAmount: expectedLiquidationAmount,
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
          creditUtilizationAmount - Number(expectedLiquidationAmount);
        const creditUtilizationUpdatedDueToLiquidationEvent =
          creditBalanceUpdatedFactory({
            utilizationAmount: creditUtilizationAmount,
            paymentDetails: {
              type: PaymentType.liquidation,
              id: liquidationId,
              amount: expectedLiquidationAmount,
              asset: 'USD',
            },
          });

        await app
          .get(LtvQueueController)
          .creditBalanceUpdatedHandler(
            creditUtilizationUpdatedDueToLiquidationEvent,
          );
        const activeMarginCalls = await request(app.getHttpServer())
          .get('/v1/margin_calls')
          .query({
            status: MarginCallStatus.active,
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(queueStub.publishEvent).toHaveBeenCalledWith(
          MARGIN_CALL_COMPLETED_TOPIC,
          {
            userId: user.id,
            ltv: (creditUtilizationAmount / ledgerValue) * 100,
            completedAt: expect.any(String),
            liquidationAmount: Number(expectedLiquidationAmount),
            ...getMarginPrices(),
          },
        );
        expect(activeMarginCalls.body).toHaveLength(0);
      });
    });
  });
});
