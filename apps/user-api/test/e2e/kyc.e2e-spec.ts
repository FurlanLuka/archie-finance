import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../e2e-test-utils/database.utils';
import { Connection } from 'typeorm';
import { AuthGuard } from '@archie/api/utils/auth0';
import {
  generateUserAccessToken,
  verifyAccessToken,
} from '../e2e-test-utils/mock.auth.utils';
import * as request from 'supertest';
import { DateTime } from 'luxon';

describe('KycController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
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
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  afterAll(async () => {
    await clearDatabase();
    await app.get(Connection).close();
    await module.close();
  });

  describe('Full KYC flow', () => {
    const fullLegalName = 'John Doe';
    const dateOfBirth: string = DateTime.now().minus({ years: 20 }).toISO();
    const location = 'Slovenia';
    const ssnDigits = 4444;

    it('/v1/kyc (GET) - Should throw an error because KYC record does not exist', async () => {
      const accessToken: string = generateUserAccessToken();

      await request(app.getHttpServer())
        .get(`/v1/kyc`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('/v1/kyc (POST) - Should add new KYC record for user', async () => {
      const accessToken: string = generateUserAccessToken();

      await request(app.getHttpServer())
        .post(`/v1/kyc`)
        .send({
          fullLegalName,
          dateOfBirth,
          location,
          ssnDigits,
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);
    });

    it('/v1/kyc (GET) - Should return KYC record for the user', async () => {
      const accessToken: string = generateUserAccessToken();

      const response = await request(app.getHttpServer())
        .get(`/v1/kyc`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        fullLegalName,
        dateOfBirth: expect.any(String),
        location,
        ssnDigits,
      });
    });

    it('/v1/onboarding (GET) - Onboarding record should have kycStage completed', async () => {
      const accessToken: string = generateUserAccessToken();

      const requestResponse = await request(app.getHttpServer())
        .get(`/v1/onboarding`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(requestResponse.body).toStrictEqual({
        kycStage: true,
        emailVerificationStage: false,
        collateralizationStage: false,
        cardActivationStage: false,
        completed: false,
      });
    });
  });
});
