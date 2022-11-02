import {
  createAmqpConnection,
  getOptions,
  Options,
  publishQueueMessage,
  uuidv4,
  group,
} from '../utils';
import { SERVICE_QUEUE_NAME } from '@archie/api/onboarding-api/constants';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-line-api/constants';
import { CARD_ACTIVATED_TOPIC } from '@archie/api/credit-api/constants';
import {
  emailVerifiedDataFactory,
  kycSubmittedDataFactory,
  mfaEnrolledDataFactory,
} from '@archie/api/user-api/test-data';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';
import { cardActivatedDataFactory } from '@archie/api/credit-api/test-data';
import { sign } from 'jsonwebtoken';

export let options: Options = getOptions();

export function setup() {
  createAmqpConnection();
}

function generateUserAccessToken(userId: string): string {
  return sign({}, 'ACTIONS_SIGNING_SECRET', {
    expiresIn: 300,
    issuer: 'AUTH0_DOMAIN',
    subject: userId,
  });
}

export default function () {
  group('Onboarding flow', () => {
    const userId: string = uuidv4();
    const controllerQueuePrefix: string = `${SERVICE_QUEUE_NAME}-onboarding`;
    const accessToken = generateUserAccessToken(userId);
    console.log(accessToken);

    // Create onboarding record

    group('KYC completed', () => {
      publishQueueMessage(
        KYC_SUBMITTED_TOPIC,
        controllerQueuePrefix,
        kycSubmittedDataFactory({
          userId,
        }),
      );
    });

    group('Email verified', () => {
      publishQueueMessage(
        EMAIL_VERIFIED_TOPIC,
        controllerQueuePrefix,
        emailVerifiedDataFactory({
          userId,
        }),
      );
    });

    group('MFA enrolled', () => {
      publishQueueMessage(
        MFA_ENROLLED_TOPIC,
        controllerQueuePrefix,
        mfaEnrolledDataFactory({
          userId,
        }),
      );
    });

    group('Collaterization stage', () => {
      publishQueueMessage(
        CREDIT_LINE_CREATED_TOPIC,
        controllerQueuePrefix,
        creditLineCreatedDataFactory({
          userId,
        }),
      );
    });

    group('Card activated', () => {
      publishQueueMessage(
        CARD_ACTIVATED_TOPIC,
        controllerQueuePrefix,
        cardActivatedDataFactory({
          userId,
        }),
      );
    });
  });
}

// onboarding - api - queue - archie.microservice.tx_credit.card.activated.v1;
// onboarding -
//   api -
//   queue -
//   onboarding -
//   archie.microservice.tx_credit.card.activated.v1;
