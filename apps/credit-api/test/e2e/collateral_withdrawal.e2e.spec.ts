/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import nock = require('nock');
import { AppModule } from '../../src/app.module';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { COLLATERAL_WITHDRAW_INITIALIZED_TOPIC } from '@archie/api/credit-api/constants';
import { ConfigVariables } from '@archie/api/user-api/constants';
import {
  assetPriceResponse,
  createUserCollateral,
  defaultCollateralTotal,
  ETH_PRICE,
} from '../test-data/collateral.stubs';
import { TransactionStatus } from 'fireblocks-sdk';
import { Credit } from '../../../../libs/api/credit-api/credit/src';
import {
  LiquidationLog,
  MarginNotification,
} from '../../../../libs/api/credit-api/margin/src';
import { Collateral } from '../../../../libs/api/credit-api/collateral/src';
import { CollateralWithdrawal } from '../../../../libs/api/credit-api/collateral-withdrawal/src/lib/collateral-withdrawal.entity';
import { AuthGuard } from '@archie/api/utils/auth0';
import { CollateralWithdrawalQueueController } from '../../../../libs/api/credit-api/collateral-withdrawal/src/lib/collateral-withdrawal.controller';
import { RizeService } from '../../../../libs/api/credit-api/rize/src';
import {
  generateUserAccessToken,
  verifyAccessToken,
  amqpStub,
  clearDatabase,
  GLOBAL_EXCHANGE_NAME,
  user,
} from '@archie/test/integration';
import * as request from 'supertest';

describe('CollateralWithdrawalController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let creditRepository: Repository<Credit>;
  let configService: ConfigService;
  let collateralRepository: Repository<Collateral>;
  let collateralWithdrawalRepository: Repository<CollateralWithdrawal>;
  let marginNotificationsRepositiory: Repository<MarginNotification>;
  let liquidationLogsRepository: Repository<LiquidationLog>;

  const userId = user.id;
  const accessToken = generateUserAccessToken();

  const defaultUserCollateral = createUserCollateral(userId);
  const MAX_LTV = 30;
  const destinationAddress = 'my_address';
  const desiredAsset = 'ETH';

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
      .overrideProvider(AmqpConnection)
      .useValue(amqpStub)
      .overrideProvider(RizeService)
      .useValue({})
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    creditRepository = app.get(getRepositoryToken(Credit));
    configService = app.get(ConfigService);
    marginNotificationsRepositiory = app.get(
      getRepositoryToken(MarginNotification),
    );
    liquidationLogsRepository = app.get(getRepositoryToken(LiquidationLog));
    collateralRepository = app.get(getRepositoryToken(Collateral));
    collateralWithdrawalRepository = app.get(
      getRepositoryToken(CollateralWithdrawal),
    );

    nock(configService.get(ConfigVariables.INTERNAL_API_URL))
      .get(`/internal/asset_price`)
      .reply(200, assetPriceResponse);
    await collateralRepository.save(defaultUserCollateral);
    await creditRepository.save({
      userId,
      totalCredit: 60,
      availableCredit: 60,
    });
  });

  afterEach(async () => {
    amqpStub.publish.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('GET /:asset/max_amount', () => {
    it('should return 400 if unsupported asset', async () => {
      const asset = 'TEH';

      await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${asset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 0 if user has no collateral in the desired asset', async () => {
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save(
        defaultUserCollateral.filter((a) => a.asset !== desiredAsset),
      );

      const response: request.Response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${desiredAsset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(0);
    });

    it('should return 0 if user has an LTV of more than .3', async () => {
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 20,
      });

      const response: request.Response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${desiredAsset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(0);
    });

    it('should return maximum amount if user has not loaned any', async () => {
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 60,
      });

      const response: request.Response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${desiredAsset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(
        defaultUserCollateral.find((c) => c.asset === 'ETH').amount,
      );
    });

    it('should return entire asset amount if LTV is away from the limit', async () => {
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 51,
      });

      const response: request.Response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${desiredAsset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(
        defaultUserCollateral.find((c) => c.asset === 'ETH').amount,
      );
    });

    it('should return partial asset amount if LTV ', async () => {
      const loanAmount = 25; // total is 100 so this makes the ltv equal to .25
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 60 - loanAmount,
      });

      const response: request.Response = await request(app.getHttpServer())
        .get(`/v1/collateral/withdraw/${desiredAsset}/max_amount`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.maxAmount).toEqual(
        (defaultCollateralTotal - loanAmount / (MAX_LTV / 100)) / ETH_PRICE, // ltv from service is returned * 100
      );
    });
  });
  describe('POST /collateral/withdraw', () => {
    it('should return 400 bad request if trying to withdraw more than collateralized', async () => {
      await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          asset: desiredAsset,
          destinationAddress,
          withdrawalAmount: 1000,
        })
        .expect(400);
    });

    it('should return 400 if user tries to withdraw a not supported asset', async () => {
      await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ asset: 'ADA', destinationAddress, withdrawalAmount: 1000 })
        .expect(400);
    });

    it('should return 400 if user tries to withdraw an asset which they have not collateralized', async () => {
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save(
        defaultUserCollateral.filter((a) => a.asset !== desiredAsset),
      );

      await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ asset: desiredAsset, destinationAddress, withdrawalAmount: 1 })
        .expect(400);
    });

    it('should withdraw collateral and publish to the exchange', async () => {
      const withdrawalAmount = 5;

      const response = await request(app.getHttpServer())
        .post(`/v1/collateral/withdraw`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ asset: desiredAsset, destinationAddress, withdrawalAmount })
        .expect(201);

      expect(response.body).toEqual({
        userId,
        asset: desiredAsset,
        withdrawalAmount,
        currentAmount: 10,
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(amqpStub.publish).toBeCalledTimes(1);
      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
        {
          asset: desiredAsset,
          withdrawalAmount,
          userId,
          destinationAddress,
          withdrawalId: expect.any(String),
        },
        undefined,
      );
      const userCollateral = await collateralRepository.findOneBy({
        userId,
        asset: desiredAsset,
      });
      expect(userCollateral.amount).toEqual(10 - withdrawalAmount);
    });
  });

  describe('Withdrawal transaction created handler', () => {
    it('should update withdrawal with transactionId', async () => {
      const transactionId = 'transaction_id';
      const withdrawal = await collateralWithdrawalRepository.save({
        userId,
        asset: desiredAsset,
        withdrawalAmount: 5,
        currentAmount: 10,
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

      expect(withdrawalResult.transactionId).toEqual(transactionId);
    });
  });
  describe('Withdrawal completed handler', () => {
    it('should update status to completed', async () => {
      const transactionId = 'transaction_id';

      const withdrawal = await collateralWithdrawalRepository.save({
        userId,
        asset: desiredAsset,
        withdrawalAmount: 5,
        currentAmount: 10,
        destinationAddress,
        transactionId,
        status: TransactionStatus.SUBMITTED,
      });

      await app
        .get(CollateralWithdrawalQueueController)
        .collateralWithdrawCompleteHandler({
          userId,
          transactionId,
          asset: desiredAsset,
        });

      const withdrawalResult = await collateralWithdrawalRepository.findOne({
        where: { id: withdrawal.id },
        select: ['id', 'status'],
      });

      expect(withdrawalResult.status).toEqual(TransactionStatus.COMPLETED);
    });

    it('should throw not found if transaction id has not been synced yet', async () => {
      const transactionId = 'transaction_id';

      await collateralWithdrawalRepository.save({
        userId,
        asset: desiredAsset,
        withdrawalAmount: 5,
        currentAmount: 10,
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
      });

      const action: Promise<void> = app
        .get(CollateralWithdrawalQueueController)
        .collateralWithdrawCompleteHandler({
          userId,
          transactionId,
          asset: desiredAsset,
        });

      await expect(action).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
