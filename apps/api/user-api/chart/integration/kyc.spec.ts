import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  generateUserAccessToken,
  initializeTestingModule,
  queueStub,
  TestDatabase,
  user,
} from '@archie/test/integration';
import * as request from 'supertest';
import { createKycBodyFactory } from '@archie/api/user-api/test-data';
import { KycDto } from '@archie/api/user-api/data-transfer-objects';
import { AppModule } from '../../src/app.module';
import { DateTime } from 'luxon';
import { KYC_SUBMITTED_TOPIC } from '@archie/api/user-api/constants';

describe('User api kyc tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Kyc submission', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(() => {
      queueStub.publishEvent.mockReset();
    });

    it('should respond with 400 status in case user is under 18', async () => {
      const kyc = createKycBodyFactory({
        dateOfBirth: new Date(),
      });

      await request(app.getHttpServer())
        .post('/v1/kyc')
        .send(kyc)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should respond with 404 KYC_NOT_FOUND error in case kyc was not created yet', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/kyc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        message: 'KYC_NOT_FOUND',
        error:
          'KYC record not found. Please submit your KYC or contact support.',
      });
    });

    it('should save and submit kyc', async () => {
      const kyc: KycDto = createKycBodyFactory();

      const response = await request(app.getHttpServer())
        .post('/v1/kyc')
        .send(kyc)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toStrictEqual({
        ...kyc,
        dateOfBirth: DateTime.fromJSDate(kyc.dateOfBirth).toISODate(),
        createdAt: expect.any(String),
      });
      expect(queueStub.publishEvent).toHaveBeenCalledWith(KYC_SUBMITTED_TOPIC, {
        userId: user.id,
        ...kyc,
      });
    });

    it('should respond with created kyc', async () => {
      const kyc: KycDto = createKycBodyFactory();

      const response = await request(app.getHttpServer())
        .get('/v1/kyc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        ...kyc,
        dateOfBirth: DateTime.fromJSDate(kyc.dateOfBirth).toISODate(),
        createdAt: expect.any(String),
      });
    });

    it('should respond with 409 KYC_ALREADY_SUBMITTED error if kyc was already created', async () => {
      const kyc: KycDto = createKycBodyFactory();

      const response = await request(app.getHttpServer())
        .post('/v1/kyc')
        .send(kyc)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(409);

      expect(response.body).toStrictEqual({
        statusCode: 409,
        message: 'KYC_ALREADY_SUBMITTED',
        error:
          'You have already submitted your KYC. If you made a mistake, please contact support.',
      });
    });
  });
});
