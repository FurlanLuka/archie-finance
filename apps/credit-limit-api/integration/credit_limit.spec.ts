import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  TestDatabase,
  createTestDatabase,
  createTestingModule,
  initializeTestingModule,
  generateUserAccessToken,
  cleanUpTestingModule,
  queueStub,
  user,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { getAssetPricesResponseDataFactory } from '@archie/api/asset-price-api/test-data';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';
import { assetListResponseData } from '@archie/api/collateral-api/test-data';
import * as request from 'supertest';
import {
  CreditLimit,
  CreditLimitQueueController,
  PeriodicCheckQueueController,
} from '@archie/api/credit-limit-api/credit-limit';
import { collateralDepositCompletedDataFactory } from '@archie/api/credit-api/test-data';
import {
  CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED,
  CREDIT_LIMIT_UPDATED_TOPIC,
  CREDIT_LINE_CREATED_TOPIC,
} from '@archie/api/credit-limit-api/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('Credit limit service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const bitcoinPrice = 20_000;
  const ethPrice = 2_000;
  const solPrice = 50;

  const getAssetPricesResponseData: GetAssetPriceResponse[] =
    getAssetPricesResponseDataFactory({
      btcPrice: bitcoinPrice,
      ethPrice: ethPrice,
      solPrice: solPrice,
    });

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();

    // Mock RPC request to return array of asset prices
    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(getAssetPricesResponseData);
    // Mock RPC request to return the asset list
    when(queueStub.request)
      .calledWith(GET_ASSET_INFORMATION_RPC)
      .mockResolvedValue(assetListResponseData);
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Create credit line with no collateral', () => {
    beforeAll(setup);
    afterAll(cleanup);

    it('should fail creating credit line because user has no collateral', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/credit_limits')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toBe(
        'ERR_CREATE_CREDIT_MINIMUM_COLLATERAL',
      );
    });
  });

  describe('Create credit line with over collateralization', () => {
    beforeAll(setup);
    afterAll(cleanup);

    it('should increase users collateral to 1 BTC', async () => {
      const collateralDepositCompletedPayload =
        collateralDepositCompletedDataFactory({
          amount: '1',
          asset: 'BTC',
        });

      await app
        .get(CreditLimitQueueController)
        .collateralDepositCompletedHandler(collateralDepositCompletedPayload);
    });

    it('should create the credit with a limit of 2_000 because user has collateralized more then credit limit', async () => {
      await request(app.getHttpServer())
        .post('/v1/credit_limits')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(queueStub.publish).toHaveBeenCalledWith(
        CREDIT_LINE_CREATED_TOPIC,
        {
          userId: user.id,
          amount: 2000,
        },
      );
    });
  });

  describe('Create credit line by collateralizing multiple assets', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const solAmount = 5;
    const ethAmount = 0.3;
    const btcAmount = 0.05;

    const creditLimit =
      (solAmount * solPrice + ethAmount * ethPrice + btcAmount * bitcoinPrice) *
      0.5;

    it(`should increase users collateral by ${btcAmount} BTC`, async () => {
      const collateralDepositCompletedPayload =
        collateralDepositCompletedDataFactory({
          amount: `${btcAmount}`,
          asset: 'BTC',
          transactionId: 'btcTransaction',
        });

      await app
        .get(CreditLimitQueueController)
        .collateralDepositCompletedHandler(collateralDepositCompletedPayload);
    });

    it(`should increase users collateral by ${solAmount} SOL`, async () => {
      const collateralDepositCompletedPayload =
        collateralDepositCompletedDataFactory({
          amount: `${solAmount}`,
          asset: 'SOL',
          transactionId: 'solTransaction',
        });

      await app
        .get(CreditLimitQueueController)
        .collateralDepositCompletedHandler(collateralDepositCompletedPayload);
    });

    it(`should increase users collateral by ${ethAmount} ETH`, async () => {
      const collateralDepositCompletedPayload =
        collateralDepositCompletedDataFactory({
          amount: `${ethAmount}`,
          asset: 'ETH',
          transactionId: 'ethTransaction',
        });

      await app
        .get(CreditLimitQueueController)
        .collateralDepositCompletedHandler(collateralDepositCompletedPayload);
    });

    it(`should create the credit with a limit of ${creditLimit} after combining all collateral value`, async () => {
      await request(app.getHttpServer())
        .post('/v1/credit_limits')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(queueStub.publish).toHaveBeenCalledWith(
        CREDIT_LINE_CREATED_TOPIC,
        {
          userId: user.id,
          amount: creditLimit,
        },
      );
    });
  });

  describe('Create credit line and adjust it after asset prices change', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const ethAmount = 1;

    const initialCreditLineLimit = (ethAmount * ethPrice) / 2;

    const ethPrice5PercentDownSwing = ethPrice * 0.95;
    const ethpriceAfter20PercentDownSwing = ethPrice5PercentDownSwing * 0.8;

    const finalCreditLineLimit =
      (ethAmount * ethpriceAfter20PercentDownSwing) / 2;

    describe('Create credit line', () => {
      it(`should increase users collateral to ${ethAmount} ETH == ${ethPrice} USD`, async () => {
        const collateralDepositCompletedPayload =
          collateralDepositCompletedDataFactory({
            amount: `${ethAmount}`,
            asset: 'ETH',
          });

        await app
          .get(CreditLimitQueueController)
          .collateralDepositCompletedHandler(collateralDepositCompletedPayload);
      });

      it(`should create the credit with a limit of ${initialCreditLineLimit} because user has collateralized more then credit limit`, async () => {
        await request(app.getHttpServer())
          .post('/v1/credit_limits')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(201);

        expect(queueStub.publish).toHaveBeenCalledWith(
          CREDIT_LINE_CREATED_TOPIC,
          {
            userId: user.id,
            amount: initialCreditLineLimit,
          },
        );
      });
    });

    describe('Trigger periodic check after eth value has reduced for 5%', () => {
      beforeAll(() => {
        const getUpdatedAssetPricesResponseData: GetAssetPriceResponse[] =
          getAssetPricesResponseDataFactory({
            btcPrice: bitcoinPrice,
            ethPrice: ethPrice5PercentDownSwing,
            solPrice: solPrice,
          });

        when(queueStub.request)
          .calledWith(GET_ASSET_PRICES_RPC)
          .mockResolvedValue(getUpdatedAssetPricesResponseData);

        // Reset mock so it doesnt contain call data from previous tests
        queueStub.publish.mockReset();
      });

      it('should trigger the periodic credit limit check and should not update users credit limit becuse collateral value has reduced for less then 10%', async () => {
        await app
          .get(PeriodicCheckQueueController)
          .creditLimitPeriodicCheckHandler({
            userIds: [user.id],
          });

        expect(queueStub.publish).not.toHaveBeenCalled();
      });
    });

    describe('Trigger periodic check after eth value has reduced for 20%', () => {
      beforeAll(() => {
        const getUpdatedAssetPricesResponseData: GetAssetPriceResponse[] =
          getAssetPricesResponseDataFactory({
            btcPrice: bitcoinPrice,
            ethPrice: ethpriceAfter20PercentDownSwing,
            solPrice: solPrice,
          });

        when(queueStub.request)
          .calledWith(GET_ASSET_PRICES_RPC)
          .mockResolvedValue(getUpdatedAssetPricesResponseData);

        // Reset mock so it doesnt contain call data from previous tests
        queueStub.publish.mockReset();
      });

      it('should trigger the periodic credit limit check and should update users credit limit becuse collateral value has reduced for more then 10%', async () => {
        await app
          .get(PeriodicCheckQueueController)
          .creditLimitPeriodicCheckHandler({
            userIds: [user.id],
          });

        expect(queueStub.publish).toHaveBeenCalledWith(
          CREDIT_LIMIT_UPDATED_TOPIC,
          {
            userId: user.id,
            creditLimit: finalCreditLineLimit,
            calculatedAt: expect.anything(),
          },
        );
      });
    });
  });

  describe('Periodic check', () => {
    let creditLimitRepository: Repository<CreditLimit>;

    beforeAll(async () => {
      await setup();

      creditLimitRepository = app.get(getRepositoryToken(CreditLimit));
    });
    afterAll(cleanup);

    it('Should publish LTV_PERIODIC_CHECK_REQUESTED events for all users divided in chunks', async () => {
      const creditLimitRecords: Partial<CreditLimit>[] = [
        ...new Array(8999),
      ].map((_, i) => ({
        userId: i.toString(),
        calculatedAt: new Date().toISOString(),
        creditLimit: 200,
        calculatedOnCollateralBalance: 400,
      }));

      await creditLimitRepository.insert(creditLimitRecords);

      await request(app.getHttpServer())
        .post(`/internal/credit_limits/periodic_check`)
        .expect(201);

      const expectedCallTimes = 4500;
      const expectedCallTimesWithoutLastCall = expectedCallTimes - 1;

      expect(queueStub.publish).toBeCalledTimes(expectedCallTimes);
      [...new Array(expectedCallTimesWithoutLastCall)].forEach(
        (_, callNumber) => {
          expect(queueStub.publish).nthCalledWith(
            callNumber + 1,
            CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED,
            {
              userIds: [expect.any(String), expect.any(String)],
            },
          );
          expect(queueStub.publish).nthCalledWith(
            expectedCallTimes,
            CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED,
            {
              userIds: [expect.any(String)],
            },
          );
        },
      );
    });
  });
});
