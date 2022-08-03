/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { COLLATERAL_WITHDRAW_INITIALIZED_TOPIC } from '@archie/api/credit-api/constants';
import {
  assetPriceResponse,
  createUserCollateral,
  defaultCollateralTotal,
  ETH_PRICE,
  ETH_STARTING_AMOUNT,
} from '../test-data/collateral.stubs';
import { TransactionStatus } from 'fireblocks-sdk';
import { Credit } from '@archie/api/credit-api/credit';
import {
  LiquidationLog,
  MarginNotification,
} from '@archie/api/credit-api/margin';
import { Collateral } from '@archie/api/credit-api/collateral';
import {
  CollateralWithdrawal,
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from '@archie/api/credit-api/collateral-withdrawal';
import { AuthGuard } from '@nestjs/passport';
import { RizeService } from '@archie/api/credit-api/rize';
import {
  verifyAccessToken,
  clearDatabase,
  queueStub,
} from '@archie/test/integration';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { QueueService } from '@archie/api/utils/queue';

describe('CollateralWithdrawalController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let creditRepository: Repository<Credit>;
  let configService: ConfigService;
  let collateralRepository: Repository<Collateral>;
  let collateralWithdrawalRepository: Repository<CollateralWithdrawal>;
  let marginNotificationsRepositiory: Repository<MarginNotification>;
  let liquidationLogsRepository: Repository<LiquidationLog>;

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
      .overrideProvider(QueueService)
      .useValue(queueStub)
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

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);

    await collateralRepository.save(defaultUserCollateral);
    await creditRepository.save({
      userId,
      totalCredit: 60,
      availableCredit: 60,
    });
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

    it('should remove collateral from the database if all of it was withdrawn', async () => {
      const asset = 'ETH';
      const withdrawalAmount = ETH_STARTING_AMOUNT;

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
