/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../e2e-test-utils/database.utils';
import { Connection, Repository } from 'typeorm';
import { verifyAccessToken } from '../e2e-test-utils/mock.auth.utils';
import { AuthGuard } from '@archie-microservices/auth0';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  LTV_LIMIT_APPROACHING_EXCHANGE,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '../../../../libs/api/credit-api/constants/src';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarginQueueController } from '../../src/modules/margin/margin.controller';
import { Credit } from '../../src/modules/credit/credit.entity';
import nock = require('nock');
import { ConfigVariables } from '../../../../libs/api/user-api/constants/src';
import { ConfigService } from '@nestjs/config';
import { MarginNotification } from '../../src/modules/margin/margin_notifications.entity';
import { MarginCall } from '../../src/modules/margin/margin_calls.entity';
import { DateTime } from 'luxon';
import { LiquidationLog } from '../../src/modules/margin/liquidation_logs.entity';
import {
  assetPriceResponse,
  BTC_PRICE,
  BTC_STARTING_AMOUNT,
  createUserCollateral,
  ETH_PRICE,
  SOL_PRICE,
  SOL_STARTING_AMOUNT,
} from '../test-data/collateral.data';
import { UUID_REGEX } from '../e2e-test-utils/regex.utils';
import { closeToMatcher } from '../e2e-test-utils/jest.utils';
import { Collateral } from '../../src/modules/collateral/collateral.entity';
import { MarginCollateralCheck } from '../../src/modules/margin/margin_collateral_check.entity';

describe.skip('MarginQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let creditRepository: Repository<Credit>;
  let configService: ConfigService;
  let marginNotificationsRepositiory: Repository<MarginNotification>;
  let marginCallRepository: Repository<MarginCall>;
  let liquidationLogsRepository: Repository<LiquidationLog>;
  let collateralRepository: Repository<Collateral>;
  let marginCollateralCheckRepository: Repository<MarginCollateralCheck>;

  const marginNotificationLtv: number[] = [65, 70, 73];
  const userId = 'userId';
  const amqpConnectionPublish: jest.Mock = jest.fn();

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
    marginCallRepository = app.get(getRepositoryToken(MarginCall));
    liquidationLogsRepository = app.get(getRepositoryToken(LiquidationLog));
    collateralRepository = app.get(getRepositoryToken(Collateral));
    marginCollateralCheckRepository = app.get(
      getRepositoryToken(MarginCollateralCheck),
    );

    nock(configService.get(ConfigVariables.INTERNAL_API_URL))
      .get(`/internal/asset_price`)
      .reply(200, assetPriceResponse);
    await collateralRepository.save(createUserCollateral(userId));
  });

  afterEach(async () => {
    amqpConnectionPublish.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('CHECK_MARGIN_EXCHANGE flow', () => {
    it('Should not do anything in case LTV is under 65% and no margin calls are active', async () => {
      const ltv = 64;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).not.toBeCalled();
    });

    it.each(marginNotificationLtv)(
      'Should send notification in case LTV is at %s %',
      async (ltv: number) => {
        await creditRepository.save({
          userId,
          totalCredit: 100,
          availableCredit: 100 - ltv,
        });

        await app
          .get(MarginQueueController)
          .checkMarginHandler({ userIds: [userId] });

        expect(amqpConnectionPublish).toBeCalledTimes(1);
        expect(amqpConnectionPublish).toBeCalledWith(
          LTV_LIMIT_APPROACHING_EXCHANGE.name,
          '',
          { userId, ltv: ltv },
        );
        expect(
          await marginNotificationsRepositiory.findOne({
            where: {
              userId: userId,
            },
          }),
        ).toEqual({
          uuid: expect.stringMatching(UUID_REGEX),
          userId: userId,
          sentAtLtv: ltv,
          active: true,
        });
      },
    );

    it.each(marginNotificationLtv)(
      'Should not send notification in case It was already sent for the same LTV level (%s %)',
      async (ltv: number) => {
        await creditRepository.save({
          userId,
          totalCredit: 100,
          availableCredit: 100 - ltv,
        });
        await marginNotificationsRepositiory.save({
          userId,
          sentAtLtv: ltv,
          active: true,
        });

        await app
          .get(MarginQueueController)
          .checkMarginHandler({ userIds: [userId] });

        expect(amqpConnectionPublish).not.toBeCalled();
      },
    );

    it.each(marginNotificationLtv)(
      'Should activate the margin notification record if It already exists in non active state and send notification (%s %)',
      async (ltv: number) => {
        await creditRepository.save({
          userId,
          totalCredit: 100,
          availableCredit: 100 - ltv,
        });
        await marginNotificationsRepositiory.save({
          userId,
          sentAtLtv: ltv,
          active: false,
        });

        await app
          .get(MarginQueueController)
          .checkMarginHandler({ userIds: [userId] });

        expect(amqpConnectionPublish).toBeCalledTimes(1);
        expect(amqpConnectionPublish).toBeCalledWith(
          LTV_LIMIT_APPROACHING_EXCHANGE.name,
          '',
          { userId, ltv: ltv },
        );
        expect(
          await marginNotificationsRepositiory.findOne({
            where: {
              userId: userId,
            },
          }),
        ).toEqual({
          uuid: expect.stringMatching(UUID_REGEX),
          userId: userId,
          sentAtLtv: ltv,
          active: true,
        });
        expect(
          await marginNotificationsRepositiory.findOne({
            where: {
              userId: userId,
            },
          }),
        ).toEqual({
          uuid: expect.stringMatching(UUID_REGEX),
          userId: userId,
          sentAtLtv: ltv,
          active: true,
        });
      },
    );

    it('Should start the margin call once ltv reaches 75%', async () => {
      const ltv = 75;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(1);
      expect(amqpConnectionPublish).toBeCalledWith(
        MARGIN_CALL_STARTED_EXCHANGE.name,
        '',
        { userId },
      );
      expect(
        await marginCallRepository.findOne({
          where: {
            userId: userId,
          },
        }),
      ).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        userId,
        deletedAt: null,
        createdAt: expect.any(Date),
      });
    });

    it('Should not send notification or trigger MARGIN_CALL_STARTED event in case It was already sent at 75% LTV', async () => {
      const ltv = 75;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });
      await marginNotificationsRepositiory.save({
        userId,
        sentAtLtv: ltv,
        active: true,
      });
      await marginCallRepository.save({
        userId,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).not.toBeCalled();
    });

    it('Should reset margin call attempt if LTV falls under 75 within 72 hours and send email', async () => {
      const ltv = 0;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100,
      });
      await marginNotificationsRepositiory.save({
        userId,
        sentAtLtv: ltv,
        active: true,
      });
      await marginCallRepository.save({
        userId,
        createdAt: DateTime.now().minus({ hours: 60 }).toISO(),
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(1);
      expect(amqpConnectionPublish).toBeCalledWith(
        MARGIN_CALL_COMPLETED_EXCHANGE.name,
        '',
        {
          userId,
          liquidation: [],
        },
      );
      const marginCall: MarginCall | undefined =
        await marginCallRepository.findOne({
          where: {
            userId: userId,
          },
        });
      expect(marginCall).toEqual(null);
      expect(
        await marginNotificationsRepositiory.findOne({
          where: {
            userId: userId,
          },
        }),
      ).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        userId,
        sentAtLtv: ltv,
        active: true,
      });
    });

    it('Should take appropriate crypto assets and send email if the LTV is above 75 for 72 hours', async () => {
      const ltv = 75;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });
      await marginNotificationsRepositiory.save({
        userId,
        sentAtLtv: ltv,
        active: true,
      });
      await marginCallRepository.save({
        userId,
        createdAt: DateTime.now().minus({ hours: 72 }).toISO(),
      });
      const expectedLiquidatedAssets = [
        {
          asset: 'SOL',
          amount: 100,
          price: 100 * SOL_PRICE,
        },
        {
          asset: 'BTC',
          amount: 0.3653846153846152,
          price: closeToMatcher(0.3653846153846152 * BTC_PRICE),
        },
      ];

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(1);
      expect(amqpConnectionPublish).toBeCalledWith(
        MARGIN_CALL_COMPLETED_EXCHANGE.name,
        '',
        {
          userId,
          liquidation: expectedLiquidatedAssets,
        },
      );
      const marginCall: MarginCall = await marginCallRepository.findOne({
        where: {
          userId: userId,
        },
        withDeleted: true,
      });
      expect(marginCall).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        userId,
        deletedAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      expect(
        await marginNotificationsRepositiory.findOne({
          where: {
            userId: userId,
          },
        }),
      ).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        userId,
        sentAtLtv: null,
        active: false,
      });
      expect(
        await liquidationLogsRepository.find({
          where: {
            userId: userId,
          },
          loadRelationIds: true,
        }),
      ).toEqual([
        {
          uuid: expect.stringMatching(UUID_REGEX),
          userId,
          marginCall: marginCall.uuid,
          ...expectedLiquidatedAssets[0],
        },
        {
          uuid: expect.stringMatching(UUID_REGEX),
          userId,
          marginCall: marginCall.uuid,
          ...expectedLiquidatedAssets[1],
        },
      ]);
      const collaterals: Collateral[] = await collateralRepository.find({
        where: {
          userId,
        },
      });
      const btcCollateral: Collateral = collaterals.find(
        (col) => col.asset === 'BTC',
      );
      expect(btcCollateral).toEqual({
        id: expect.stringMatching(UUID_REGEX),
        userId: userId,
        asset: 'BTC',
        amount: BTC_STARTING_AMOUNT - expectedLiquidatedAssets[1].amount,
      });
      const solCollateral: Collateral = collaterals.find(
        (col) => col.asset === 'SOL',
      );
      expect(solCollateral).toEqual({
        id: expect.stringMatching(UUID_REGEX),
        userId: userId,
        asset: 'SOL',
        amount: SOL_STARTING_AMOUNT - expectedLiquidatedAssets[0].amount,
      });
    });

    it('Should take appropriate crypto assets and send email if the LTV is above 85', async () => {
      const ltv = 85;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });
      await marginNotificationsRepositiory.save({
        userId,
        sentAtLtv: ltv,
        active: false,
      });
      const expectedLiquidatedAssets = [
        {
          asset: 'SOL',
          amount: 100,
          price: 100 * SOL_PRICE,
        },
        {
          asset: 'BTC',
          amount: 1,
          price: 1 * BTC_PRICE,
        },
        {
          asset: 'ETH',
          amount: 3.541666666666666,
          price: closeToMatcher(3.541666666666666 * ETH_PRICE),
        },
      ];

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(1);
      expect(amqpConnectionPublish).toBeCalledWith(
        MARGIN_CALL_COMPLETED_EXCHANGE.name,
        '',
        {
          userId,
          liquidation: expectedLiquidatedAssets,
        },
      );
      const marginCall = await marginCallRepository.findOne({
        where: {
          userId: userId,
        },
        withDeleted: true,
      });
      expect(marginCall).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        userId,
        deletedAt: expect.any(Date),
        createdAt: expect.any(Date),
      });
      expect(
        await marginNotificationsRepositiory.findOne({
          where: {
            userId: userId,
          },
        }),
      ).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        userId,
        sentAtLtv: null,
        active: false,
      });
      expect(
        await liquidationLogsRepository.find({
          where: {
            userId: userId,
          },
          loadRelationIds: true,
        }),
      ).toEqual([
        {
          uuid: expect.stringMatching(UUID_REGEX),
          userId,
          marginCall: marginCall.uuid,
          ...expectedLiquidatedAssets[0],
        },
        {
          uuid: expect.stringMatching(UUID_REGEX),
          userId,
          marginCall: marginCall.uuid,
          ...expectedLiquidatedAssets[1],
        },
        {
          uuid: expect.stringMatching(UUID_REGEX),
          userId,
          marginCall: marginCall.uuid,
          ...expectedLiquidatedAssets[2],
        },
      ]);
    });

    it('Should not take any crypto assets in case enough were already liquidated', async () => {
      const ltv = 85;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });
      await liquidationLogsRepository.save([
        {
          userId: userId,
          asset: 'BTC',
          price: 10,
          amount: 1,
        },
        {
          userId: userId,
          asset: 'SOL',
          price: 40,
          amount: 1,
        },
      ]);

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(0);
      const marginCall = await marginCallRepository.findOne({
        where: {
          userId: userId,
        },
      });
      expect(marginCall).toEqual(null);
    });

    it('Should not send notification in case LTV is at 65% but the user only holds USDC', async () => {
      const ltv = 65;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });
      await collateralRepository.delete({
        userId,
      });
      await collateralRepository.save({
        userId,
        asset: 'USDC',
        amount: 100,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(0);
    });

    it('Should not do anything in case collateral value did not change for at least 10%', async () => {
      const collateralBalance = 100;
      await marginCollateralCheckRepository.save({
        checked_at_collateral_balance: collateralBalance,
        userId,
      });
      const ltv = 85;
      await creditRepository.save({
        userId,
        totalCredit: collateralBalance,
        availableCredit: collateralBalance - ltv,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(0);
    });

    it('Should not do anything in case collateral value did not change for at least 10%', async () => {
      const collateralBalance = 100;
      await marginCollateralCheckRepository.save({
        checked_at_collateral_balance: collateralBalance - 9,
        userId,
      });
      const ltv = 85;
      await creditRepository.save({
        userId,
        totalCredit: collateralBalance,
        availableCredit: collateralBalance - ltv,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(0);
    });

    it('Should check for the margin call in case collateral value changes by at least 10%', async () => {
      const collateralBalance = 100;
      await marginCollateralCheckRepository.save({
        checked_at_collateral_balance: collateralBalance - 10,
        userId,
      });
      const ltv = 85;
      await creditRepository.save({
        userId,
        totalCredit: collateralBalance,
        availableCredit: collateralBalance - ltv,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpConnectionPublish).toBeCalledTimes(1);
    });
  });
});
