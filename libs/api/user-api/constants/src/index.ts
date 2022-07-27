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
  INTERNAL_API_URL = 'INTERNAL_API_URL',
  QUEUE_URL = 'QUEUE_URL',
  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
}

export const KYC_SUBMITTED_EXCHANGE = {
  name: 'user.kyc.submitted.fx',
  type: 'fanout',
};
export const EMAIL_VERIFIED_EXCHANGE = {
  name: 'user.email.verified.fx',
  type: 'fanout',
};
export const MFA_ENROLLED_EXCHANGE = {
  name: 'user.mfa.enrolled.fx',
  type: 'fanout',
};
