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
import {
  collateralDepositTransactionCompletedPayloadFactory,
  collateralWithdrawalTransactionErrorPayloadFactory,
  collateralWithdrawalTransactionSubmittedPayloadFactory,
  collateralWithdrawalTransactionUpdatedPayloadFactory,
} from '@archie/api/fireblocks-api/test-data';
import {
  DepositQueueController,
  WithdrawQueueController,
} from '@archie/api/ledger-api/ledger';
import { BigNumber } from 'bignumber.js';
import {
  Ledger,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects';
import { INITIATE_COLLATERAL_WITHDRAWAL_COMMAND } from '@archie/api/fireblocks-api/constants';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { CollateralWithdrawalTransactionUpdatedStatus } from '@archie/api/fireblocks-api/data-transfer-objects';

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

    const assetId = 'ETH';
    const assetAmount = '1';

    const utilizationAmount = 500;

    const maxWithdrawalAmount = BigNumber(ETH_PRICE)
      .multipliedBy(assetAmount)
      .minus(BigNumber(utilizationAmount).dividedBy(0.3))
      .dividedBy(ETH_PRICE);

    const loanBalancesResponse: GetLoanBalancesResponse = {
      totalCredit: 5000,
      availableCredit: 2500,
      utilizationAmount: utilizationAmount,
      calculatedAt: 'sometime',
    };

    const destinationAddress = 'destinationAddress';

    let internalTransactionId = '';

    let initialLedger;

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

      initialLedger = {
        value: BigNumber(assetAmount).multipliedBy(ETH_PRICE).toString(),
        accounts: [
          {
            assetAmount: assetAmount,
            assetId: assetId,
            assetPrice: ETH_PRICE.toString(),
            accountValue: BigNumber(assetAmount)
              .multipliedBy(ETH_PRICE)
              .toString(),
          },
        ],
      };

      expect(response.body).toStrictEqual<Ledger>(initialLedger);
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
          assetId: 'ETH',
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
          assetId: 'ETH',
          amount: BigNumber(assetAmount).plus(1),
          destinationAddress: 'destinationAddress',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.message).toStrictEqual('WITHDRAWAL_AMOUNT_TOO_HIGH');
    });

    it(`should start the withdrawal of half of maximum withdrawable ETH`, async () => {
      const maxAmountResponse = await request(app.getHttpServer())
        .get('/v1/ledger/withdraw/ETH/max_amount')
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
        .multipliedBy(ETH_PRICE)
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
            assetPrice: ETH_PRICE.toString(),
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
              calculatedAt: expect.any(String),
            },
          ],
          action: {
            type: LedgerActionType.WITHDRAWAL,
          },
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

      internalTransactionId = withdrawResponse.body.id;
    });

    it('should handle the transaction submitted and updated event and decrease ledger account by the network fee', async () => {
      const ledgerResponse = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const ledgerAssetAmount = ledgerResponse.body.accounts[0].assetAmount;

      const collateralWithdrawalTransactionSubmittedPayload =
        collateralWithdrawalTransactionSubmittedPayloadFactory({
          internalTransactionId,
        });

      await app
        .get(WithdrawQueueController)
        .withdrawalTransactionSubmitted(
          collateralWithdrawalTransactionSubmittedPayload,
        );

      const networkFee = '0.0000000001';

      const updatedLedgerAssetAmount =
        BigNumber(ledgerAssetAmount).minus(networkFee);

      const updatedLedgerValue = BigNumber(updatedLedgerAssetAmount)
        .multipliedBy(ETH_PRICE)
        .decimalPlaces(2, BigNumber.ROUND_DOWN);

      const collateralWithdrawalTransactionUpdatedPayload =
        collateralWithdrawalTransactionUpdatedPayloadFactory({
          internalTransactionId,
          status: CollateralWithdrawalTransactionUpdatedStatus.IN_PROGRESS,
          networkFee,
        });

      await app
        .get(WithdrawQueueController)
        .withdrawalTransactionUpdated(
          collateralWithdrawalTransactionUpdatedPayload,
        );

      const updatedLedgerResponse = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(updatedLedgerResponse.body).toStrictEqual({
        ...ledgerResponse.body,
        accounts: [
          {
            ...ledgerResponse.body.accounts[0],
            assetAmount: updatedLedgerAssetAmount.toString(),
            accountValue: updatedLedgerValue.toString(),
          },
        ],
      });
    });

    it('should revert ledger back to pre-withdrawal value because the withdrawal failed', async () => {
      const collateralWithdrawalTransactionErrorPayload =
        collateralWithdrawalTransactionErrorPayloadFactory({
          internalTransactionId,
        });

      await app
        .get(WithdrawQueueController)
        .withdrawalTransactionError(
          collateralWithdrawalTransactionErrorPayload,
        );

      const ledgerResponse = await request(app.getHttpServer())
        .get('/v1/ledger')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(ledgerResponse.body).toStrictEqual(initialLedger);
    });
  });
});
