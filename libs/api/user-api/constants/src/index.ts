import {
  EmailVerifiedPayload,
  KycSubmittedPayload,
  MfaRemovedPayload,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { Event } from '@archie/api/utils/queue';

export const SERVICE_NAME = 'user-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  AUTH0_M2M_CLIENT_ID = 'AUTH0_M2M_CLIENT_ID',
  AUTH0_M2M_CLIENT_SECRET = 'AUTH0_M2M_CLIENT_SECRET',
  AUTH0_M2M_DOMAIN = 'AUTH0_M2M_DOMAIN',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  QUEUE_URL = 'QUEUE_URL',
  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
  REDIS_URL = 'REDIS_URL',
  DEFAULT_ROLE_ID = 'DEFAULT_ROLE_ID',
}

export const KYC_SUBMITTED_TOPIC = new Event<KycSubmittedPayload>(
  'user.kyc.submitted',
  1,
  {
    isSensitive: true,
  },
);

export const EMAIL_VERIFIED_TOPIC = new Event<EmailVerifiedPayload>(
  'user.email.verified',
  1,
  {
    isSensitive: true,
  },
);

export const MFA_ENROLLED_TOPIC = new Event<MfaEnrolledPayload>(
  'user.mfa.enrolled',
  1,
);

export const MFA_REMOVED_TOPIC = new Event<MfaRemovedPayload>(
  'user.mfa.removed',
  1,
);

export const GET_USER_KYC_RPC = 'get.user.kyc.rpc';
export const GET_USER_EMAIL_ADDRESS_RPC = 'get.user.email_address.rpc';
