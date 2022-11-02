import {
  createAmqpConnection,
  getOptions,
  Options,
  publishQueueMessage,
  uuidv4,
  group,
} from '../utils';
import { SERVICE_NAME } from '@archie/api/onboarding-api/constants';
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

export let options: Options = {
  vus: 10,
  duration: '20s',
  userAgent: 'k6-stress-test',
};

export function setup() {
  console.log('setup');
  createAmqpConnection();
}

export default function () {
  group('Onboarding flow', () => {
    const userId: string = uuidv4();

    group('KYC completed', () => {
      publishQueueMessage(
        KYC_SUBMITTED_TOPIC,
        SERVICE_NAME,
        kycSubmittedDataFactory({
          userId,
        }),
      );
    });

    group('Email verified', () => {
      publishQueueMessage(
        EMAIL_VERIFIED_TOPIC,
        SERVICE_NAME,
        emailVerifiedDataFactory({
          userId,
        }),
      );
    });

    group('MFA enrolled', () => {
      publishQueueMessage(
        MFA_ENROLLED_TOPIC,
        SERVICE_NAME,
        mfaEnrolledDataFactory({
          userId,
        }),
      );
    });

    group('Collaterization stage', () => {
      publishQueueMessage(
        CREDIT_LINE_CREATED_TOPIC,
        SERVICE_NAME,
        creditLineCreatedDataFactory({
          userId,
        }),
      );
    });

    group('Card activated', () => {
      publishQueueMessage(
        CARD_ACTIVATED_TOPIC,
        SERVICE_NAME,
        cardActivatedDataFactory({
          userId,
        }),
      );
    });
  });
}
