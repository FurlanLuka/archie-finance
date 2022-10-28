import { Event } from '@archie/api/utils/queue/events';
import { OnboardingUpdatedPayload } from '@archie/api/onboarding-api/data-transfer-objects';

export const SERVICE_NAME = 'onboarding-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  QUEUE_URL = 'QUEUE_URL',
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
}

export const ONBOARDING_UPDATED_TOPIC = new Event<OnboardingUpdatedPayload>(
  'onboarding.onboarding.updated',
  1,
);
