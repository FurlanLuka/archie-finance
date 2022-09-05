export const SERVICE_NAME = 'ltv-api';
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
}

export const LTV_UPDATED_TOPIC = 'ltv.ltv.updated';
export const MULTIPLE_LTV_UPDATED_TOPIC = 'ltv.ltv_multiple.updated';
export const LTV_PERIODIC_CHECK_REQUESTED_TOPIC =
  'ltv.ltv_periodic_check.requested';
