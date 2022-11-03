import {
  createAmqpConnection,
  getOptions,
  publishQueueMessage,
  uuidv4,
  group,
  httpGet,
  check,
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
import { getAccessToken } from '../utils/access-token';

export let options = getOptions();

let API_BASE_URL: string | undefined;

export function setup() {
  createAmqpConnection();

  API_BASE_URL = __ENV.API_BASE_URL;

  if (API_BASE_URL === undefined) {
    throw new Error('API_BASE_URL_ENV_VARIABLE_MISSING');
  }
}

export default function () {
  const userId: string = uuidv4();
  const accessToken: string = getAccessToken(userId);

  group('Onboarding flow', () => {
    const controllerQueuePrefix: string = `${SERVICE_QUEUE_NAME}-onboarding`;

    group('Create onboarding record', () => {
      const response = httpGet({
        uri: `${API_BASE_URL}/v1/onboarding`,
        accessToken,
      });

      check(response, {
        'is status 200': (r) => r.status === 200,
      });
    });

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
