/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { clearDatabase, queueStub } from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { assetListResponse, ETH_PRICE } from '../test-data/collateral.stubs';
import { Collateral } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/collateral.entity';
import { CreditLimit } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/credit_limit.entity';
import { CreditLimitQueueController } from '../../../../libs/api/credit-limit-api/credit-limit/src/lib/credit_limit.controller';
import { CREDIT_LIMIT_INCREASED_TOPIC } from '../../../../libs/api/credit-limit-api/constants/src';
import { MarginCheck } from '../../../../libs/api/margin-api/margin/src/lib/margin_check.entity';
import { MarginNotification } from '../../../../libs/api/margin-api/margin/src/lib/margin_notifications.entity';
import { MarginCall } from '../../../../libs/api/margin-api/margin/src/lib/margin_calls.entity';
import { MarginQueueController } from '../../../../libs/api/margin-api/margin/src/lib/margin.controller';
import { LtvUpdatedPayload } from '../../../../libs/api/ltv-api/data-transfer-objects/src';

describe('MarginQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let marginCallRepository: Repository<MarginCall>;
  let marginCheckRepository: Repository<MarginCheck>;
  let marginNotificationRepository: Repository<MarginNotification>;

  const userId = 'userId';

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueService)
      .useValue(queueStub)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    marginCallRepository = app.get(getRepositoryToken(MarginCall));
    marginCheckRepository = app.get(getRepositoryToken(MarginCheck));
    marginNotificationRepository = app.get(
      getRepositoryToken(MarginNotification),
    );
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe.skip('LTV_UPDATED flow', () => {
    it('Should check for a margin call once the ltv is updated', async () => {
      const payload: LtvUpdatedPayload = {
        userId,
        ltv: 90,
        calculatedOn: {
          collateral: [],
          collateralBalance: 100,
          utilizedCreditAmount: 10,
        },
      };

      await app.get(MarginQueueController).ltvUpdatedHandler(payload);
    });
  });
});
