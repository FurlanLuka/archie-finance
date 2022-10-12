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
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  emailVerifiedDataFactory,
  kycSubmittedDataFactory,
  mfaEnrolledDataFactory,
} from '@archie/api/user-api/test-data';
import { OnboardingQueueController } from '@archie/api/onboarding-api/onboarding';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';
import { cardActivatedDataFactory } from '@archie/api/credit-api/test-data';
import { ONBOARDING_UPDATED_TOPIC } from '@archie/api/onboarding-api/constants';
import { onboardingUpdatedPayloadFactory } from '../../../libs/api/onboarding-api/test-data/src/lib/onboarding';

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
    afterEach(() => {
      queueStub.publish.mockReset();
    });

    it('should throw an error because onboarding record was not created yet', async () => {
      const kycSubmittedPayload = kycSubmittedDataFactory();

      await expect(
        app
          .get(OnboardingQueueController)
          .kycSubmittedEventHandler(kycSubmittedPayload),
      ).rejects.toThrowError('ONBOARDING_RECORD_NOT_SETUP_YET');
    });

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

      expect(queueStub.publish).toHaveBeenCalledWith(
        ONBOARDING_UPDATED_TOPIC,
        onboardingUpdatedPayloadFactory({
          kycStage: true,
        }),
      );
    });

    it('should complete the mfa stage', async () => {
      const mfaEnrolledPayload = mfaEnrolledDataFactory();

      await app
        .get(OnboardingQueueController)
        .mfaEnrollmentEventHandler(mfaEnrolledPayload);

      expect(queueStub.publish).toHaveBeenCalledWith(
        ONBOARDING_UPDATED_TOPIC,
        onboardingUpdatedPayloadFactory({
          kycStage: true,
          mfaEnrollmentStage: true,
        }),
      );
    });

    it('should complete the email verification stage', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();

      await app
        .get(OnboardingQueueController)
        .emailVerifiedEventHandler(emailVerifiedPayload);

      expect(queueStub.publish).toHaveBeenCalledWith(
        ONBOARDING_UPDATED_TOPIC,
        onboardingUpdatedPayloadFactory({
          kycStage: true,
          mfaEnrollmentStage: true,
          emailVerificationStage: true,
        }),
      );
    });

    it('should complete the collateralization stage', async () => {
      const creditLineCreatedPayload = creditLineCreatedDataFactory();

      await app
        .get(OnboardingQueueController)
        .collateralReceivedEventHandler(creditLineCreatedPayload);

      expect(queueStub.publish).toHaveBeenCalledWith(
        ONBOARDING_UPDATED_TOPIC,
        onboardingUpdatedPayloadFactory({
          kycStage: true,
          mfaEnrollmentStage: true,
          emailVerificationStage: true,
          collateralizationStage: true,
        }),
      );
    });

    it('should complete the card activation stage', async () => {
      const creditLineCreatedPayload = cardActivatedDataFactory();

      await app
        .get(OnboardingQueueController)
        .cardActivatedEventHandler(creditLineCreatedPayload);

      expect(queueStub.publish).toHaveBeenCalledWith(
        ONBOARDING_UPDATED_TOPIC,
        onboardingUpdatedPayloadFactory({
          kycStage: true,
          mfaEnrollmentStage: true,
          emailVerificationStage: true,
          collateralizationStage: true,
          cardActivationStage: true,
          completed: true,
        }),
      );
    });

    it('should return all stages completed', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        kycStage: true,
        emailVerificationStage: true,
        collateralizationStage: true,
        cardActivationStage: true,
        mfaEnrollmentStage: true,
        completed: true,
      });
    });
  });
});
