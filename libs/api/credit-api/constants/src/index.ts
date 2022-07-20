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
  RIZE_MQ_HOST = 'RIZE_MQ_HOST',
  RIZE_MQ_TOPIC_PREFIX = 'RIZE_MQ_TOPIC_PREFIX',
  RIZE_MQ_USERNAME = 'RIZE_MQ_USERNAME',
  RIZE_MQ_PASSWORD = 'RIZE_MQ_PASSWORD',
  QUEUE_URL = 'QUEUE_URL',
  LIQUIDATION_VAULT_ACCOUNT_ID = 'LIQUIDATION_VAULT_ACCOUNT_ID',
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

export const MARGIN_CALL_COMPLETED_EXCHANGE = {
  name: 'credit.margin_call.completed.fx',
  type: 'fanout',
};

export const LTV_LIMIT_APPROACHING_EXCHANGE = {
  name: 'credit.margin_call.ltv_limit_approaching.fx',
  type: 'fanout',
};

export const MARGIN_CHECK_REQUESTED_EXCHANGE = {
  name: 'credit.margin_call.check_requested.fx',
  type: 'fanout',
};

export const CREDIT_LIMIT_ADJUST_REQUESTED_EXCHANGE = {
  name: 'credit.limit.adjust_requested.fx',
  type: 'fanout',
};

export const CREDIT_LIMIT_DECREASED = {
  name: 'credit.limit.decreased.fx',
  type: 'fanout',
};

export const CREDIT_LIMIT_INCREASED = {
  name: 'credit.limit.increased.fx',
  type: 'fanout',
};

export const COLLATERAL_DEPOSITED_EXCHANGE = {
  name: 'credit.collateral.deposited.fx',
  type: 'fanout',
};

export const MARGIN_CALL_STARTED_EXCHANGE = {
  name: 'credit.margin_call.started.fx',
  type: 'fanout',
};

export const COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE = {
  name: 'credit.collateral.withdraw.initialized.fx',
  type: 'fanout',
};

export const COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE = {
  name: 'credit.collateral.withdraw.transaction.created.fx',
  type: 'fanout',
};

export const COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE = {
  name: 'credit.collateral.withdraw.completed.fx',
  type: 'fanout',
};
