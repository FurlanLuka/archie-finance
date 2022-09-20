/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { clearDatabase, queueStub } from '@archie/test/integration';
import { QueueService } from '@archie/api/utils/queue';
import { LtvCredit } from '../../../libs/api/ltv-api/ltv/src/lib/credit.entity';
import { LTV_PERIODIC_CHECK_REQUESTED_TOPIC } from '@archie/api/ltv-api/constants';
import * as request from 'supertest';

describe('POST /internal/ltv/periodic_check (e2e)', () => {
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

  describe('Ltv periodic check api', () => {
    it('Should publish LTV_PERIODIC_CHECK_REQUESTED events for all users divided in chunks', async () => {
      const credits: Partial<LtvCredit>[] = [...new Array(8999)].map(() => ({
        userId: Math.random().toString(),
        calculatedAt: new Date().toISOString(),
        utilizationAmount: 10,
      }));
      await ltvCreditRepository.insert(credits);

      await request(app.getHttpServer())
        .post(`/internal/ltv/periodic_check`)
        .expect(201);

      const expectedCallTimes = 4500;
      const expectedCallTimesWithoutLastCall = expectedCallTimes - 1;
      expect(queueStub.publish).toBeCalledTimes(expectedCallTimes);
      [...new Array(expectedCallTimesWithoutLastCall)].forEach(
        (_, callNumber) => {
          expect(queueStub.publish).nthCalledWith(
            callNumber + 1,
            LTV_PERIODIC_CHECK_REQUESTED_TOPIC,
            {
              userIds: [expect.any(String), expect.any(String)],
            },
          );
          expect(queueStub.publish).nthCalledWith(
            expectedCallTimes,
            LTV_PERIODIC_CHECK_REQUESTED_TOPIC,
            {
              userIds: [expect.any(String)],
            },
          );
        },
      );
    });
  });
});
