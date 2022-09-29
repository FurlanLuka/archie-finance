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
import { AssetPrices } from '@archie/api/ledger-api/assets';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetLoanBalancesResponse } from '@archie/api/peach-api/data-transfer-objects';
import { GET_LOAN_BALANCES_RPC } from '@archie/api/peach-api/constants';
import { when } from 'jest-when';
import { collateralDepositTransactionCompletedPayloadFactory } from '@archie/api/fireblocks-api/test-data';
import { DepositQueueController } from '@archie/api/ledger-api/ledger';
import { BigNumber } from 'bignumber.js';
import { Ledger } from '@archie/api/ledger-api/data-transfer-objects';
import { INITIATE_COLLATERAL_WITHDRAWAL_COMMAND } from '@archie/api/fireblocks-api/constants';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';

describe('Ledger api withdrawal tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const BITCOIN_PRICE = 10_000;
  const ETH_PRICE = 2_000;
  const SOL_PRICE = 40;
  const USDC_PRICE = 1;

  const setAssetPrices = async (
    assetPrices: {
      assetId: string;
      price: number;
    }[],
  ): Promise<void> => {
    const assetPriceRepository: Repository<AssetPrices> = app.get(
      getRepositoryToken(AssetPrices),
    );

    await assetPriceRepository.save(
      assetPrices.map((record) => ({
        assetId: record.assetId,
        price: record.price,
        currency: 'USD',
        dailyChange: 1,
      })),
    );
  };

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();

    await setAssetPrices([
      {
        assetId: 'BTC',
        price: BITCOIN_PRICE,
      },
      {
        assetId: 'ETH',
        price: ETH_PRICE,
      },
      {
        assetId: 'SOL',
        price: SOL_PRICE,
      },
      {
        assetId: 'USDC',
        price: USDC_PRICE,
      },
    ]);
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  const setupLoanBalancesResponse = (response: GetLoanBalancesResponse) => {
    when(queueStub.request)
      .calledWith(GET_LOAN_BALANCES_RPC, { userId: user.id })
      .mockResolvedValue(response);
  };

  describe('Deposit the collateral and withdraw full amount because credit utilization is at 0', () => {
    beforeAll(setup);
    afterAll(cleanup);

    const assetId = 'BTC';
    const assetAmount = '1';

    const utilizationAmount = 1124;

    const maxWithdrawalAmount = BigNumber(BITCOIN_PRICE)
      .multipliedBy(assetAmount)
      .minus(BigNumber(utilizationAmount).dividedBy(0.3))
      .dividedBy(BITCOIN_PRICE);

    const loanBalancesResponse: GetLoanBalancesResponse = {
      totalCredit: 5000,
      availableCredit: 2500,
      utilizationAmount: utilizationAmount,
      calculatedAt: 'sometime',
    };

    const destinationAddress = 'destinationAddress';

    beforeEach(() => {
      setupLoanBalancesResponse(loanBalancesResponse);
    });

    it(`should deposit ${assetAmount} ${assetId} to setup ledger for withdrawal`, async () => {
      const collateralDepositTransactionCompletedPayload =
        collateralDepositTransactionCompletedPayloadFactory({
          assetId: assetId,
          amount: assetAmount,
        });

      await app
        .get(DepositQueueController)
        .depositHandler(collateralDepositTransactionCompletedPayload);

      const response = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual<Ledger>({
        value: BigNumber(assetAmount).multipliedBy(BITCOIN_PRICE).toString(),
        accounts: [
          {
            assetAmount: assetAmount,
            assetId: assetId,
            assetPrice: BITCOIN_PRICE.toString(),
            accountValue: BigNumber(assetAmount)
              .multipliedBy(BITCOIN_PRICE)
              .toString(),
          },
        ],
      });
    });

    it(`should return 400 because requested asset is not supported`, async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/ledger/withdraw')
        .send({
          assetId: 'RANDOM_ASSET',
          amount: '1',
          destinationAddress: 'destinationAddress',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toStrictEqual('INVALID_ASSET');
    });

    it(`should return 400 because amount is invalid`, async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/ledger/withdraw')
        .send({
          assetId: 'BTC',
          amount: '0',
          destinationAddress: 'destinationAddress',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toStrictEqual('INVALID_WITHDRAWAL_AMOUNT');
    });

    it(`should return 400 because amount is too high`, async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/ledger/withdraw')
        .send({
          assetId: 'BTC',
          amount: BigNumber(assetAmount).plus(1),
          destinationAddress: 'destinationAddress',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toStrictEqual('WITHDRAWAL_AMOUNT_TOO_HIGH');
    });

    it(`should successfully withdraw half of maximum available BTC balance for withdrawal`, async () => {
      const maxAmountResponse = await request(app.getHttpServer())
        .get('/v1/ledger/withdraw/BTC/max_amount')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(maxAmountResponse.body.maxAmount).toEqual(
        maxWithdrawalAmount.toString(),
      );

      const withdrawalAmount = maxWithdrawalAmount
        .dividedBy(2)
        .decimalPlaces(18);

      const newAssetAmount = BigNumber(assetAmount).minus(withdrawalAmount);

      const withdrawResponse = await request(app.getHttpServer())
        .post('/v1/ledger/withdraw/')
        .send({
          assetId,
          amount: withdrawalAmount,
          destinationAddress,
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const ledgerResponse = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const newBitcoinAccountValue = newAssetAmount
        .multipliedBy(BITCOIN_PRICE)
        .decimalPlaces(2, BigNumber.ROUND_DOWN)
        .toString();

      const newBitcoinAccountAmount = newAssetAmount
        .decimalPlaces(18)
        .toString();

      expect(ledgerResponse.body).toStrictEqual<Ledger>({
        value: newBitcoinAccountValue,
        accounts: [
          {
            assetAmount: newBitcoinAccountAmount,
            assetId: assetId,
            assetPrice: BITCOIN_PRICE.toString(),
            accountValue: newBitcoinAccountValue,
          },
        ],
      });

      expect(queueStub.publish).toHaveBeenCalledWith(
        LEDGER_ACCOUNT_UPDATED_TOPIC,
        {
          userId: user.id,
          ledgerAccounts: [
            {
              assetId,
              assetAmount: newBitcoinAccountAmount,
              accountValue: newBitcoinAccountValue,
            },
          ],
        },
      );

      expect(queueStub.publish).toHaveBeenCalledWith(
        INITIATE_COLLATERAL_WITHDRAWAL_COMMAND,
        {
          userId: user.id,
          assetId,
          amount: withdrawalAmount.toString(),
          internalTransactionId: withdrawResponse.body.id,
          destinationAddress,
        },
      );
    });
  });
});
