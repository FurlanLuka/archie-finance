/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  Logger,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { COLLATERAL_WITHDRAW_INITIALIZED_TOPIC } from '@archie/api/credit-api/constants';
import {
  assetPriceResponse,
  createUserCollateral,
  defaultCollateralTotal,
  ETH_PRICE,
  ETH_STARTING_AMOUNT,
  getLoanBalancesResponse,
} from '../test-data/collateral.stubs';
import { TransactionStatus } from 'fireblocks-sdk';
import { Collateral } from '@archie/api/credit-api/collateral';
import {
  CollateralWithdrawal,
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from '@archie/api/credit-api/collateral-withdrawal';
import { AuthGuard } from '@archie/api/utils/auth0';
import { RizeService } from '@archie/api/credit-api/rize';
import {
  verifyAccessToken,
  clearDatabase,
  queueStub,
  generateUserAccessToken,
  equalToBigNumber,
} from '@archie/test/integration';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { GET_LOAN_BALANCES_RPC } from '@archie/api/peach-api/constants';
import { BigNumber } from 'bignumber.js';

describe('CollateralWithdrawalController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let collateralRepository: Repository<Collateral>;
  let collateralWithdrawalRepository: Repository<CollateralWithdrawal>;

  const userId = 'userId';
  const user = { id: userId };
  const accessToken = generateUserAccessToken(user);

  const defaultUserCollateral = createUserCollateral(userId);
  const MAX_LTV = 0.3;
  const destinationAddress = 'my_address';

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();

          const accessToken: string =
            request.headers.authorization.split(' ')[1];

          request.user = verifyAccessToken(accessToken);

          return true;
        },
      })
      .overrideProvider(QueueService)
      .useValue(queueStub)
      .overrideProvider(RizeService)
      .useValue({})
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useLogger(new Logger());

    await app.init();

    collateralRepository = app.get(getRepositoryToken(Collateral));
    collateralWithdrawalRepository = app.get(
      getRepositoryToken(CollateralWithdrawal),
    );

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);

    when(queueStub.request)
      .calledWith(GET_LOAN_BALANCES_RPC, { userId })
      .mockResolvedValue(getLoanBalancesResponse);

    await collateralRepository.save(defaultUserCollateral);
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('GET /:asset/max_amount', () => {
    // defaultCollateralTotal = 100
    it('should return 400 if unsupported asset', async () => {
      await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/TEH/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 0 if user has no collateral in the desired asset', async () => {
      const desiredAsset = 'ETH';
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save(
        defaultUserCollateral.filter((a) => a.asset !== desiredAsset),
      );
      const response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${desiredAsset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(0);
    });

    it('should return 0 if user has an LTV of more than .3', async () => {
      when(queueStub.request)
        .calledWith(GET_LOAN_BALANCES_RPC, { userId })
        .mockResolvedValue({
          totalCredit: defaultCollateralTotal / 2,
          availableCredit: (defaultCollateralTotal / 2) * 0.25,
          utilizationAmount: (defaultCollateralTotal / 2) * 0.75,
        });

      const response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/ETH/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(0);
    });

    it('should return maximum amount if user has not loaned any', async () => {
      when(queueStub.request)
        .calledWith(GET_LOAN_BALANCES_RPC, { userId })
        .mockResolvedValue({
          totalCredit: defaultCollateralTotal / 2,
          availableCredit: defaultCollateralTotal / 2,
          utilizationAmount: 0,
        });

      const response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/ETH/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(
        Number(defaultUserCollateral.find((c) => c.asset === 'ETH')?.amount),
      );
    });

    it('should return entire asset amount if LTV is away from the limit', async () => {
      when(queueStub.request)
        .calledWith(GET_LOAN_BALANCES_RPC, { userId })
        .mockResolvedValue({
          totalCredit: defaultCollateralTotal / 2,
          availableCredit: (defaultCollateralTotal / 2) * 0.9,
          utilizationAmount: (defaultCollateralTotal / 2) * 0.1,
        });

      const response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/ETH/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(
        Number(defaultUserCollateral.find((c) => c.asset === 'ETH')?.amount),
      );
    });

    it('should return partial asset amount if LTV closer to the limit', async () => {
      const loanAmount = (defaultCollateralTotal / 2) * 0.5;

      when(queueStub.request)
        .calledWith(GET_LOAN_BALANCES_RPC, { userId })
        .mockResolvedValue({
          totalCredit: defaultCollateralTotal / 2,
          availableCredit: (defaultCollateralTotal / 2) * 0.5,
          utilizationAmount: loanAmount,
        });

      const response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/ETH/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(
        (defaultCollateralTotal - loanAmount / MAX_LTV) / ETH_PRICE,
      );
    });
  });
  describe('POST /collateral/withdraw', () => {
    it('should return 400 bad request if trying to withdraw more than collateralized', async () => {
      await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw/`)
        .send({
          asset: 'ETH',
          withdrawalAmount: 9999,
          destinationAddress: 'address',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 400 if user tries to withdraw a not supported asset', async () => {
      await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw/`)
        .send({
          asset: 'TEH',
          withdrawalAmount: 9999,
          destinationAddress: 'address',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw 404 if user tries to withdraw an asset which they have not collateralized', async () => {
      const desiredAsset = 'ETH';
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save(
        defaultUserCollateral.filter((a) => a.asset !== desiredAsset),
      );
      await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw/`)
        .send({
          asset: 'ETH',
          withdrawalAmount: 2,
          destinationAddress: 'address',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should remove collateral from the database if all of it was withdrawn', async () => {
      const asset = 'ETH';
      const withdrawalAmount = ETH_STARTING_AMOUNT;

      const response = await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw/`)
        .send({
          asset,
          withdrawalAmount: Number(withdrawalAmount),
          destinationAddress,
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toEqual({
        userId,
        asset,
        withdrawalAmount,
        currentAmount: equalToBigNumber(BigNumber(10)),
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
        fee: null,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(
        COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
        {
          asset,
          withdrawalAmount,
          userId,
          destinationAddress,
          withdrawalId: expect.any(String),
        },
      );
      const userCollateral = await collateralRepository.findOneBy({
        userId,
        asset,
      });
      expect(userCollateral).toBeNull();
    });

    it('should withdraw collateral and publish to the exchange', async () => {
      const asset = 'ETH';
      const withdrawalAmount = '5';
      const response = await app
        .get(CollateralWithdrawalController)
        .withdrawUserCollateral(
          {
            user: { sub: userId },
          },
          {
            asset,
            destinationAddress,
            withdrawalAmount: Number(withdrawalAmount),
          },
        );
      expect(response).toEqual({
        userId,
        asset,
        withdrawalAmount,
        currentAmount: equalToBigNumber(BigNumber(10)),
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
        fee: null,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(
        COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
        {
          asset,
          withdrawalAmount: equalToBigNumber(BigNumber(withdrawalAmount)),
          userId,
          destinationAddress,
          withdrawalId: expect.any(String),
        },
      );
      const userCollateral = await collateralRepository.findOneBy({
        userId,
        asset,
      });
      expect(userCollateral?.amount).toEqual(
        equalToBigNumber(BigNumber(10).minus(BigNumber(withdrawalAmount))),
      );
    });
  });

  describe('Withdrawal transaction created handler', () => {
    it('should update withdrawal with transactionId', async () => {
      const transactionId = 'transaction_id';
      const withdrawal = await collateralWithdrawalRepository.save({
        userId,
        asset: 'ETH',
        withdrawalAmount: '5',
        currentAmount: '10',
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
      });

      await app
        .get(CollateralWithdrawalQueueController)
        .collateralWithdrawTransactionCreatedHandler({
          withdrawalId: withdrawal.id,
          transactionId,
        });

      const withdrawalResult = await collateralWithdrawalRepository.findOne({
        where: { id: withdrawal.id },
        select: ['id', 'transactionId'],
      });

      expect(withdrawalResult?.transactionId).toEqual(transactionId);
    });
  });

  describe('Withdrawal completed handler', () => {
    it('should update status to completed and decrement collateral value with fee', async () => {
      const transactionId = 'transaction_id';
      const startingAmount = '100';
      const fee = '1';
      await collateralRepository.insert({
        userId,
        asset: 'ETH',
        amount: startingAmount,
      });
      const withdrawal = await collateralWithdrawalRepository.save({
        userId,
        asset: 'ETH',
        withdrawalAmount: '5',
        currentAmount: '10',
        destinationAddress,
        transactionId,
        status: TransactionStatus.SUBMITTED,
      });

      await app
        .get(CollateralWithdrawalQueueController)
        .collateralWithdrawCompleteHandler({
          userId,
          transactionId,
          asset: 'ETH',
          fee: fee,
        });

      const withdrawalResult = await collateralWithdrawalRepository.findOne({
        where: { id: withdrawal.id, fee },
        select: ['id', 'status'],
      });

      expect(withdrawalResult?.status).toEqual(TransactionStatus.COMPLETED);
      expect(
        await collateralRepository.findOneBy({
          userId,
          asset: 'ETH',
          amount: BigNumber(startingAmount).minus(BigNumber(fee)).toString(),
        }),
      ).not.toBeNull();
    });

    it('should throw not found if transaction id has not been synced yet', async () => {
      const transactionId = 'transaction_id';
      await collateralWithdrawalRepository.save({
        userId,
        asset: 'ETH',
        withdrawalAmount: '5',
        currentAmount: '10',
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
      });

      await expect(
        app
          .get(CollateralWithdrawalQueueController)
          .collateralWithdrawCompleteHandler({
            userId,
            transactionId,
            asset: 'ETH',
            fee: '1',
          }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
