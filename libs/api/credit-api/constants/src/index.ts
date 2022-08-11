export const SERVICE_NAME = 'peach-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
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
  PEACH_API_KEY = 'PEACH_API_KEY',
  PEACH_BASE_URL = 'PEACH_BASE_URL',
  PEACH_COMPANY_ID = 'PEACH_COMPANY_ID',
  PEACH_BORROWER_ROLE_ID = 'PEACH_BORROWER_ROLE_ID',
  PEACH_LOAN_ID = 'PEACH_LOAN_ID',
  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
}

export const COLLATERAL_RECEIVED_TOPIC = 'credit.collateral.received';

export const CARD_ACTIVATED_TOPIC = 'credit.card.activated';

export const PHONE_NUMBER_VERIFIED_TOPIC = 'apto.phone_number.verified';

export const MARGIN_CALL_COMPLETED_TOPIC = 'credit.margin_call.completed';

export const LTV_LIMIT_APPROACHING_TOPIC =
  'credit.margin_call.ltv_limit_approaching';

export const MARGIN_CHECK_REQUESTED_TOPIC =
  'credit.margin_call.check_requested';

export const CREDIT_LIMIT_ADJUST_REQUESTED_TOPIC =
  'credit.limit.adjust_requested';

export const CREDIT_LIMIT_DECREASED_TOPIC = 'credit.limit.decreased';

export const CREDIT_LIMIT_INCREASED_TOPIC = 'credit.limit.increased';

export const COLLATERAL_DEPOSITED_TOPIC = 'credit.collateral.deposited';

export const MARGIN_CALL_STARTED_TOPIC = 'credit.margin_call.started';

export const COLLATERAL_WITHDRAW_INITIALIZED_TOPIC =
  'credit.collateral.withdraw.initialized';

export const COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC =
  'credit.collateral.withdraw.transaction.created';

export const COLLATERAL_WITHDRAW_COMPLETED_TOPIC =
  'credit.collateral.withdraw.completed';

export const CREDIT_FUNDS_LOADED_TOPIC = 'credit.founds.loaded';

export const TRANSACTION_UPDATED_TOPIC = 'credit.transaction.updated';
export const CREDIT_LINE_UPDATED_TOPIC = 'credit.credit_line.updated';

export const GET_COLLATERAL_RPC = 'get.collateral.rpc';
export const GET_COLLATERAL_VALUE_RPC = 'get.collateral.value.rpc';
