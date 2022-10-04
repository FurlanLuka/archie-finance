export const SERVICE_NAME = 'credit-limit-api';
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
  ASSET_LIST = 'ASSET_LIST',
}

export const CREDIT_LINE_CREATED_TOPIC = 'credit_limit.credit_line.created';
export const CREDIT_LIMIT_UPDATED_TOPIC = 'credit_limit.credit_limit.updated';

export const CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED =
  'credit_limit.credit_limit_periodic_check.requested';
