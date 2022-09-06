import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LtvCollateral } from '../../../../libs/api/ltv-api/ltv/src/lib/collateral.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  clearDatabase,
  queueStub,
  verifyAccessToken,
} from '../../../../libs/api/test/integration/src';
import { QueueService } from '../../../../libs/api/utils/queue/src';
import { RizeService } from '../../../../libs/api/credit-api/rize/src';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '../../../../libs/api/asset-price-api/constants/src';
import { assetPriceResponse, ETH_PRICE } from '../test-data/collateral.stubs';
import { CollateralQueueController } from '../../../../libs/api/ltv-api/ltv/src/lib/collateral/collateral.controller';
import { LtvCredit } from '../../../../libs/api/ltv-api/ltv/src/lib/credit.entity';
import { LTV_UPDATED_TOPIC } from '../../../../libs/api/ltv-api/constants/src';

describe('CollateralQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let ltvCollateralRepository: Repository<LtvCollateral>;
  let ltvCreditRepository: Repository<LtvCredit>;

  let configService: ConfigService;

  const userId = 'userId';
  const asset = 'ETH';

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

    ltvCollateralRepository = app.get(getRepositoryToken(LtvCollateral));
    ltvCreditRepository = app.get(getRepositoryToken(LtvCredit));

    configService = app.get(ConfigService);

    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(assetPriceResponse);
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('COLLATERAL_WITHDRAW_INITIALIZED flow', () => {
    it('Should publish ltv updated event if collateral has been withdrawn', async () => {
      const utilizationAmount = 10;
      const startingEthAmount = 1;
      const withdrawalAmount = 0.3;
      await ltvCollateralRepository.insert({
        userId,
        asset,
        amount: startingEthAmount,
      });
      await ltvCreditRepository.insert({
        userId,
        utilizationAmount: utilizationAmount,
        calculatedAt: new Date().toISOString(),
      });

      await app
        .get(CollateralQueueController)
        .collateralWithdrawInitializedHandler({
          userId,
          asset,
          withdrawalAmount: withdrawalAmount,
          destinationAddress: 'destinationAddress',
          withdrawalId: 'withdrawalId',
        });

      const collateralBalance =
        ETH_PRICE * (startingEthAmount - withdrawalAmount);
      expect(queueStub.publish).toBeCalledTimes(1);
      expect(queueStub.publish).toBeCalledWith(LTV_UPDATED_TOPIC, {
        userId,
        ltv: (utilizationAmount / collateralBalance) * 100,
        calculatedOn: {
          utilizedCreditAmount: utilizationAmount,
          collateralBalance: collateralBalance,
          collateral: [
            {
              amount: startingEthAmount - withdrawalAmount,
              asset,
              price: collateralBalance,
            },
          ],
        },
      });
    });
  });
});
