import nock = require('nock');
import { verifyAccessToken } from '../e2e-test-utils/mock.auth.utils';
import { AppModule } from '../../src/app.module';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { clearDatabase } from '../e2e-test-utils/database.utils';
import { Connection, Repository } from 'typeorm';
import { AuthGuard } from '@archie-microservices/auth0';
import { Collateral } from '../../src/modules/collateral/collateral.entity';
import { LiquidationLog } from '../../src/modules/margin/liquidation_logs.entity';
import { MarginNotification } from '../../src/modules/margin/margin_notifications.entity';
import { Credit } from '../../src/modules/credit/credit.entity';
import { CollateralWithdrawal } from '../../src/modules/collateral/withdrawal/collateral_withdrawal.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigVariables } from '../../../../libs/api/user-api/constants/src';
import {
  assetPriceResponse,
  createUserCollateral,
  defaultCollateralTotal,
} from '../test-data/collateral.data';
import { CollateralWithdrawalController } from '../../src/modules/collateral/withdrawal/collateral_withdrawal.controller';

const MAX_LTV = 30;
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
  const amqpConnectionPublish: jest.Mock = jest.fn();

  const defaultUserCollateral = createUserCollateral(userId);

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
      .useValue({
        publish: amqpConnectionPublish,
      })
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
      totalCredit: 100,
      availableCredit: 100,
    });
  });

  afterEach(async () => {
    amqpConnectionPublish.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('GET /:asset/max_amount', () => {
    // defaultCollateralTotal = 100
    it('should return 404 if unsupported asset', async () => {
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
        expect(error).toBeInstanceOf(NotFoundException);
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

    it('should return correct amount', async () => {
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

      expect(response.maxAmount).toEqual(10);
    });
  });
});
