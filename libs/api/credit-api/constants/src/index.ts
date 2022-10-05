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
  RIZE_ENVIRONMENT = 'RIZE_ENVIRONMENT',
  RIZE_PROGRAM_ID = 'RIZE_PROGRAM_ID',
  RIZE_HMAC_KEY = 'RIZE_HMAC_KEY',
  RIZE_MQ_HOST = 'RIZE_MQ_HOST',
  RIZE_MQ_TOPIC_PREFIX = 'RIZE_MQ_TOPIC_PREFIX',
  RIZE_MQ_USERNAME = 'RIZE_MQ_USERNAME',
  RIZE_MQ_PASSWORD = 'RIZE_MQ_PASSWORD',
  PLAID_ENVIRONMENT = 'PLAID_ENVIRONMENT',
  PLAID_CLIENT_ID = 'PLAID_CLIENT_ID',
  PLAID_SECRET = 'PLAID_SECRET',
  PLAID_REDIRECT_URI = 'PLAID_REDIRECT_URI',
  QUEUE_URL = 'QUEUE_URL',
  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
  REDIS_URL = 'REDIS_URL',
}

export const COLLATERAL_RECEIVED_TOPIC = 'credit.collateral.received';

export const CARD_ACTIVATED_TOPIC = 'credit.card.activated';

export const COLLATERAL_DEPOSITED_TOPIC = 'credit.collateral.deposited';

export const COLLATERAL_DEPOSIT_COMPLETED_TOPIC =
  'credit.collateral_deposit.completed';

export const COLLATERAL_LIQUIDATION_INITIATED_TOPIC =
  'credit.collateral_liquidation.initiated';

export const COLLATERAL_WITHDRAW_INITIALIZED_TOPIC =
  'credit.collateral.withdraw.initialized';

export const COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC =
  'credit.collateral.withdraw.transaction.created';

export const COLLATERAL_WITHDRAW_COMPLETED_TOPIC =
  'credit.collateral.withdraw.completed';

export const TRANSACTION_UPDATED_TOPIC = 'credit.transaction.updated';

export const GET_COLLATERAL_RPC = 'get.collateral.rpc';
export const GET_COLLATERAL_VALUE_RPC = 'get.collateral.value.rpc';
