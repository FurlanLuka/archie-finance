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
import { AuthGuard } from '@archie/api/utils/auth0';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC,
  LTV_LIMIT_APPROACHING_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/credit-api/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarginQueueController } from '../../../../libs/api/credit-api/margin/src/lib/margin.controller';
import * as nock from 'nock';
import { ConfigVariables } from '@archie/api/user-api/constants';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import {
  assetPriceResponse,
  BTC_PRICE,
  BTC_STARTING_AMOUNT,
  createUserCollateral,
  defaultCollateralTotal,
  ETH_PRICE,
  SOL_PRICE,
  SOL_STARTING_AMOUNT,
} from '../test-data/collateral.data';
import { UUID_REGEX } from '../e2e-test-utils/regex.utils';
import { closeToMatcher } from '../e2e-test-utils/jest.utils';
import { Credit } from '@archie/api/credit-api/credit';
import {
  LiquidationLog,
  MarginCall,
  MarginCollateralCheck,
  MarginNotification,
} from '@archie/api/credit-api/margin';
import { Collateral } from '@archie/api/credit-api/collateral';
import { amqpStub, GLOBAL_EXCHANGE_NAME } from '../e2e-test-utils/queue.utils';
import { RizeService } from '../../../../libs/api/credit-api/rize/src';

describe.only('MarginQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let creditRepository: Repository<Credit>;
  let configService: ConfigService;
  let marginNotificationsRepositiory: Repository<MarginNotification>;
  let liquidationLogsRepository: Repository<LiquidationLog>;
  let marginCallRepository: Repository<MarginCall>;
  let collateralRepository: Repository<Collateral>;
  let marginCollateralCheckRepository: Repository<MarginCollateralCheck>;

  const marginNotificationLtv: number[] = [65, 70, 73];
  const userId = 'userId';
  const COLLATERAL_SALE_LTV = 0.85;
  const MARGIN_CALL_START_LTV = 0.75;
  const MARGIN_CALL_END_LTV = 0.6;

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
    amqpStub.publish.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('CHECK_MARGIN_TOPIC flow', () => {
    it('Should adjust credit limit at the first time and not send notification in case LTV is under 65% and no margin calls are active', async () => {
      const ltv = 64;
      await creditRepository.save({
        userId,
        totalCredit: 100,
        availableCredit: 100 - ltv,
      });

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpStub.publish).toBeCalledTimes(1);
      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC,
        {
          userIds: [userId],
        },
        undefined,
      );
    });

    it.each(marginNotificationLtv)(
      'Should send notification in case LTV is at %s %',
      async (ltv: number) => {
        await creditRepository.save({
          userId,
          totalCredit: 100,
          availableCredit: 100 - ltv,
        });
        const userLoan = ltv;

        await app
          .get(MarginQueueController)
          .checkMarginHandler({ userIds: [userId] });

        expect(amqpStub.publish).toBeCalledWith(
          GLOBAL_EXCHANGE_NAME,
          LTV_LIMIT_APPROACHING_TOPIC,
          {
            userId,
            ltv: ltv,
            collateralBalance: defaultCollateralTotal,
            priceForMarginCall: userLoan / MARGIN_CALL_START_LTV,
            priceForPartialCollateralSale: userLoan / COLLATERAL_SALE_LTV,
          },
          undefined,
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

        expect(amqpStub.publish).toBeCalledWith(
          GLOBAL_EXCHANGE_NAME,
          CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC,
          {
            userIds: [userId],
          },
          undefined,
        );
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
        const userLoan = ltv;

        await app
          .get(MarginQueueController)
          .checkMarginHandler({ userIds: [userId] });

        expect(amqpStub.publish).toBeCalledWith(
          GLOBAL_EXCHANGE_NAME,
          LTV_LIMIT_APPROACHING_TOPIC,
          {
            userId,
            ltv: ltv,
            collateralBalance: defaultCollateralTotal,
            priceForMarginCall: userLoan / MARGIN_CALL_START_LTV,
            priceForPartialCollateralSale: userLoan / COLLATERAL_SALE_LTV,
          },
          undefined,
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
      const userLoan = ltv;

      await app
        .get(MarginQueueController)
        .checkMarginHandler({ userIds: [userId] });

      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        MARGIN_CALL_STARTED_TOPIC,
        {
          userId,
          ltv: ltv,
          collateralBalance: defaultCollateralTotal,
          priceForMarginCall: userLoan / MARGIN_CALL_START_LTV,
          priceForPartialCollateralSale: userLoan / COLLATERAL_SALE_LTV,
        },
        undefined,
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

      expect(amqpStub.publish).toBeCalledTimes(1);
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

      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        MARGIN_CALL_COMPLETED_TOPIC,
        {
          userId,
          liquidation: [],
          collateralBalance: defaultCollateralTotal,
          liquidationAmount: 0,
          ltv: 0,
          priceForMarginCall: 0,
          priceForPartialCollateralSale: 0,
        },
        undefined,
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
      const userLoan = ltv;
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
      const liquidationLogs: LiquidationLog[] =
        await liquidationLogsRepository.find({
          where: {
            userId: userId,
          },
          loadRelationIds: true,
        });
      expect(liquidationLogs).toEqual([
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
      const liquidatedPrice: number = liquidationLogs.reduce(
        (amount, log) => amount + log.price,
        0,
      );
      const newCollateralBalance: number =
        defaultCollateralTotal - liquidatedPrice;
      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        MARGIN_CALL_COMPLETED_TOPIC,
        {
          userId,
          liquidation: expectedLiquidatedAssets,
          ltv: MARGIN_CALL_END_LTV * 100,
          liquidationAmount: liquidatedPrice,
          collateralBalance: newCollateralBalance,
          priceForMarginCall:
            (userLoan - liquidatedPrice) / MARGIN_CALL_START_LTV,
          priceForPartialCollateralSale:
            (userLoan - liquidatedPrice) / COLLATERAL_SALE_LTV,
        },
        undefined,
      );
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
      const userLoan = ltv;
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
      const liquidationLogs: LiquidationLog[] =
        await liquidationLogsRepository.find({
          where: {
            userId: userId,
          },
          loadRelationIds: true,
        });
      expect(liquidationLogs).toEqual([
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

      const liquidatedPrice: number = liquidationLogs.reduce(
        (amount, log) => amount + log.price,
        0,
      );
      const newCollateralBalance: number =
        defaultCollateralTotal - liquidatedPrice;
      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        MARGIN_CALL_COMPLETED_TOPIC,
        {
          userId,
          liquidation: expectedLiquidatedAssets,
          ltv: MARGIN_CALL_END_LTV * 100,
          liquidationAmount: liquidatedPrice,
          collateralBalance: newCollateralBalance,
          priceForMarginCall:
            (userLoan - liquidatedPrice) / MARGIN_CALL_START_LTV,
          priceForPartialCollateralSale:
            (userLoan - liquidatedPrice) / COLLATERAL_SALE_LTV,
        },
        undefined,
      );
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

      const marginCall = await marginCallRepository.findOne({
        where: {
          userId: userId,
        },
      });
      expect(marginCall).toEqual(null);
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

      expect(amqpStub.publish).toBeCalledTimes(0);
    });

    it('Should not check anything in case collateral value did not change for at least 10%', async () => {
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

      expect(amqpStub.publish).toBeCalledTimes(0);
    });

    it('Should check for the margin call and adjust credit line in case collateral value changes by at least 10%', async () => {
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

      expect(amqpStub.publish).toBeCalledTimes(2);
      expect(amqpStub.publish).toBeCalledWith(
        GLOBAL_EXCHANGE_NAME,
        CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC,
        {
          userIds: [userId],
        },
        undefined,
      );
    });
  });
});
