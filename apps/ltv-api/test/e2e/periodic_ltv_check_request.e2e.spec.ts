/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { clearDatabase, queueStub } from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { LtvCredit } from '../../../../libs/api/ltv-api/ltv/src/lib/credit.entity';
import { LTV_PERIODIC_CHECK_REQUESTED_TOPIC } from '@archie/api/ltv-api/constants';
import * as request from 'supertest';

describe('CreditQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let ltvCreditRepository: Repository<LtvCredit>;

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

    ltvCreditRepository = app.get(getRepositoryToken(LtvCredit));
  });

  afterEach(async () => {
    queueStub.publish.mockReset();
    queueStub.request.mockReset();
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('CREDIT_BALANCE_UPDATED flow', () => {
    it('Should publish ltv updated event if credit utilization amount changes', async () => {
      const credits: Partial<LtvCredit>[] = [...new Array(9000)].map(() => ({
        userId: Math.random().toString(),
        calculatedAt: new Date().toISOString(),
        utilizationAmount: 10,
      }));
      await ltvCreditRepository.insert(credits);

      await request(app.getHttpServer())
        .post(`/internal/ltvs/periodic_check`)
        .expect(201);

      expect(queueStub.publish).toBeCalledTimes(4500);
      expect(queueStub.publish).toBeCalledWith(
        LTV_PERIODIC_CHECK_REQUESTED_TOPIC,
        {
          userIds: [expect.any(String), expect.any(String)],
        },
      );
    });
  });
});
