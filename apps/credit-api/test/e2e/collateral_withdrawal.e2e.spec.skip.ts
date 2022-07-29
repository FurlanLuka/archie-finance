/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import nock = require('nock');
import { verifyAccessToken } from '../e2e-test-utils/mock.auth.utils';
import { AppModule } from '../../src/app.module';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ExecutionContext,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { clearDatabase } from '../e2e-test-utils/database.utils';
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
} from '../test-data/collateral.data';
import { TransactionStatus } from 'fireblocks-sdk';
import { Credit } from '../../../../libs/api/credit-api/credit/src';
import {
  LiquidationLog,
  MarginNotification,
} from '../../../../libs/api/credit-api/margin/src';
import { Collateral } from '../../../../libs/api/credit-api/collateral/src';
import { CollateralWithdrawal } from '../../../../libs/api/credit-api/collateral-withdrawal/src/lib/collateral-withdrawal.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from '../../../../libs/api/credit-api/collateral-withdrawal/src/lib/collateral-withdrawal.controller';
import { amqpStub, GLOBAL_EXCHANGE_NAME } from '../e2e-test-utils/queue.utils';

describe('CollateralWithdrawalController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let creditRepository: Repository<Credit>;
  let configService: ConfigService;
  let marginNotificationsRepositiory: Repository<MarginNotification>;
  let liquidationLogsRepository: Repository<LiquidationLog>;
  let collateralRepository: Repository<Collateral>;
  let collateralWithdrawalRepository: Repository<CollateralWithdrawal>;

  const userId = 'userId';

  const defaultUserCollateral = createUserCollateral(userId);
  const MAX_LTV = 30;
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
      .overrideProvider(AmqpConnection)
      .useValue(amqpStub)
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
    // defaultCollateralTotal = 100
    it('should return 400 if unsupported asset', async () => {
      try {
        await app
          .get(CollateralWithdrawalController)
          .getUserMaxWithdrawalAmount(
            {
              user: { sub: userId },
            },
            'TEH',
          );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return 0 if user has no collateral in the desired asset', async () => {
      const desiredAsset = 'ETH';
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save(
        defaultUserCollateral.filter((a) => a.asset !== desiredAsset),
      );

      const response = await app
        .get(CollateralWithdrawalController)
        .getUserMaxWithdrawalAmount(
          {
            user: { sub: userId },
          },
          desiredAsset,
        );

      expect(response.maxAmount).toEqual(0);
    });

    it('should return 0 if user has an LTV of more than .3', async () => {
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 20,
      });

      const response = await app
        .get(CollateralWithdrawalController)
        .getUserMaxWithdrawalAmount(
          {
            user: { sub: userId },
          },
          'ETH',
        );

      expect(response.maxAmount).toEqual(0);
    });

    it('should return maximum amount if user has not loaned any', async () => {
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 60,
      });

      const response = await app
        .get(CollateralWithdrawalController)
        .getUserMaxWithdrawalAmount(
          {
            user: { sub: userId },
          },
          'ETH',
        );

      expect(response.maxAmount).toEqual(
        defaultUserCollateral.find((c) => c.asset === 'ETH').amount,
      );
    });

    it('should return entire asset amount if LTV is away from the limit', async () => {
      await creditRepository.save({
        userId,
        totalCredit: 60,
        availableCredit: 51,
      });

      const response = await app
        .get(CollateralWithdrawalController)
        .getUserMaxWithdrawalAmount(
          {
            user: { sub: userId },
          },
          'ETH',
        );

      expect(response.maxAmount).toEqual(
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

      const response = await app
        .get(CollateralWithdrawalController)
        .getUserMaxWithdrawalAmount(
          {
            user: { sub: userId },
          },
          'ETH',
        );

      expect(response.maxAmount).toEqual(
        (defaultCollateralTotal - loanAmount / (MAX_LTV / 100)) / ETH_PRICE, // ltv from service is returned * 100
      );
    });
  });
  describe('POST /collateral/withdraw', () => {
    it('should return 400 bad request if trying to withdraw more than collateralized', async () => {
      try {
        await app.get(CollateralWithdrawalController).withdrawUserCollateral(
          {
            user: { sub: userId },
          },
          { asset: 'ETH', destinationAddress, withdrawalAmount: 1000 },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return 400 if user tries to withdraw a not supported asset', async () => {
      try {
        await app.get(CollateralWithdrawalController).withdrawUserCollateral(
          {
            user: { sub: userId },
          },
          { asset: 'ADA', destinationAddress, withdrawalAmount: 1000 },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return 400 if user tries to withdraw an asset which they have not collateralized', async () => {
      const desiredAsset = 'ETH';
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save(
        defaultUserCollateral.filter((a) => a.asset !== desiredAsset),
      );
      try {
        await app.get(CollateralWithdrawalController).withdrawUserCollateral(
          {
            user: { sub: userId },
          },
          { asset: desiredAsset, destinationAddress, withdrawalAmount: 1 },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should withdraw collateral and publish to the exchange', async () => {
      const asset = 'ETH';
      const withdrawalAmount = 5;
      const response = await app
        .get(CollateralWithdrawalController)
        .withdrawUserCollateral(
          {
            user: { sub: userId },
          },
          { asset, destinationAddress, withdrawalAmount },
        );
      expect(response).toEqual({
        userId,
        asset,
        withdrawalAmount,
        currentAmount: 10,
        destinationAddress,
        transactionId: null,
        status: TransactionStatus.SUBMITTED,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(amqpStub.publish).toBeCalledTimes(1);
      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        COLLATERAL_WITHDRAW_INITIALIZED_TOPIC,
        {
          asset,
          withdrawalAmount,
          userId,
          destinationAddress,
          withdrawalId: expect.any(String),
        },
        undefined,
      );
      const userCollateral = await collateralRepository.findOneBy({
        userId,
        asset,
      });
      expect(userCollateral.amount).toEqual(10 - withdrawalAmount);
    });
  });

  describe('Withdrawal transaction created handler', () => {
    it('should update withdrawal with transactionId', async () => {
      const transactionId = 'transaction_id';
      const withdrawal = await collateralWithdrawalRepository.save({
        userId,
        asset: 'ETH',
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
        asset: 'ETH',
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
          asset: 'ETH',
        });

      const withdrawalResult = await collateralWithdrawalRepository.findOne({
        where: { id: withdrawal.id },
        select: ['id', 'status'],
      });

      expect(withdrawalResult.status).toEqual(TransactionStatus.COMPLETED);
    });

    it('should throw not found if transaction id has not been synced yet', async () => {
      const transactionId = 'transaction_id';

      try {
        await collateralWithdrawalRepository.save({
          userId,
          asset: 'ETH',
          withdrawalAmount: 5,
          currentAmount: 10,
          destinationAddress,
          transactionId: null,
          status: TransactionStatus.SUBMITTED,
        });

        await app
          .get(CollateralWithdrawalQueueController)
          .collateralWithdrawCompleteHandler({
            userId,
            transactionId,
            asset: 'ETH',
          });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
