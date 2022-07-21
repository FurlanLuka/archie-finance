export const SERVICE_NAME = 'referral-system-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  ARCHIE_MARKETING_WEBSITE_URL = 'ARCHIE_MARKETING_WEBSITE_URL',
  QUEUE_URL = 'QUEUE_URL',
  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
}

export const APPLIED_TO_WAITLIST_EXCHANGE = {
  name: 'waitlist.joined.fx',
  type: 'fanout',
};

export const JOINED_WAITLIST_EXCHANGE = {
  name: 'waitlist.joined.fx',
  type: 'fanout',
};
