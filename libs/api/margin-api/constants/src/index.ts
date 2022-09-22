export const SERVICE_NAME = 'margin-api';
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

export const COLLATERAL_SALE_LTV_LIMIT = 90;
export const LTV_MARGIN_CALL_LIMIT = 75;
export const LIQUIDATION_TARGET_LTV = 60;

export const LTV_LIMIT_APPROACHING_TOPIC =
  'margin.margin_call.ltv_limit_approaching';
export const MARGIN_CALL_COMPLETED_TOPIC = 'margin.margin_call.completed';
export const MARGIN_CALL_STARTED_TOPIC = 'margin.margin_call.started';
