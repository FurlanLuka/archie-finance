export const SERVICE_NAME = 'credit-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  INTERNAL_API_URL = 'INTERNAL_API_URL',
  APTO_API_KEY = 'APTO_API_KEY',
  APTO_API_URL = 'APTO_API_URL',
  APTO_CARD_PROGRAME_ID = 'APTO_CARD_PROGRAME_ID',
  APTO_PUBLIC_KEY = 'APTO_PUBLIC_KEY',
  APTO_PRIVATE_KEY = 'APTO_PRIVATE_KEY',
  APTO_FUNDING_BALANCE_ID = 'FUNDING_BALANCE_ID',
  RIZE_ENVIRONMENT = 'RIZE_ENVIRONMENT',
  RIZE_PROGRAM_ID = 'RIZE_PROGRAM_ID',
  RIZE_HMAC_KEY = 'RIZE_HMAC_KEY',
  QUEUE_URL = 'QUEUE_URL',
}

export const COLLATERAL_RECEIVED_EXCHANGE = {
  name: 'credit.collateral.received.fx',
  type: 'fanout',
};

export const CARD_ACTIVATED_EXCHANGE = {
  name: 'credit.card.activated.fx',
  type: 'fanout',
};

export const PHONE_NUMBER_VERIFIED_EXCHANGE = {
  name: 'apto.phone_number.verified.fx',
  type: 'fanout',
};

export const COLLATERAL_DEPOSITED_EXCHANGE = {
  name: 'credit.collateral.deposited.fx',
  type: 'fanout',
};

export const MARGIN_CALL_COMPLETED_EXCHANGE = {
  name: 'credit.margin_call.completed.fx',
  type: 'fanout',
};

export const MARGIN_CALL_STARTED_EXCHANGE = {
  name: 'credit.margin_call.started.fx',
  type: 'fanout',
};
