import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  generateUserAccessToken,
  initializeTestingModule,
  TestDatabase,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  emailVerifiedDataFactory,
  kycSubmittedDataFactory,
  mfaEnrolledDataFactory,
} from '@archie/api/user-api/test-data';
import { OnboardingQueueController } from '@archie/api/onboarding-api/onboarding';

jest.setTimeout(30000);

describe('Onboarding service tests', () => {
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

  describe('Create and update onboarding record for user', () => {
    beforeAll(setup);
    afterAll(cleanup);

    it('should return empty onboarding record', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        kycStage: false,
        emailVerificationStage: false,
        collateralizationStage: false,
        cardActivationStage: false,
        mfaEnrollmentStage: false,
        completed: false,
      });
    });

    it('should complete kyc stage', async () => {
      const kycSubmittedPayload = kycSubmittedDataFactory();

      await app
        .get(OnboardingQueueController)
        .kycSubmittedEventHandler(kycSubmittedPayload);
    });

    it('should complete the mfa stage', async () => {
      const mfaEnrolledPayload = mfaEnrolledDataFactory();

      await app
        .get(OnboardingQueueController)
        .mfaEnrollmentEventHandler(mfaEnrolledPayload);
    });

    it('should complete the email verification stage', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();

      await app
        .get(OnboardingQueueController)
        .emailVerifiedEventHandler(emailVerifiedPayload);
    });

    it('should return kyc stage completed', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        kycStage: true,
        emailVerificationStage: true,
        collateralizationStage: false,
        cardActivationStage: false,
        mfaEnrollmentStage: true,
        completed: false,
      });
    });
  });
});
