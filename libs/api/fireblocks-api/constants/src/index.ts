export const SERVICE_NAME = 'fireblocks-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  FIREBLOCKS_VAULT_ACCOUNT_ID = 'FIREBLOCKS_VAULT_ACCOUNT_ID',
  ASSET_LIST = 'ASSET_LIST',
  FIREBLOCKS_API_KEY = 'FIREBLOCKS_API_KEY',
  FIREBLOCKS_PRIVATE_KEY = 'FIREBLOCKS_PRIVATE_KEY',
  FIREBLOCKS_PUBLIC_KEY = 'FIREBLOCKS_PUBLIC_KEY',
  COINGECKO_API_URI = 'COINGECKO_API_URI',
  QUEUE_URL = 'QUEUE_URL',
}

/**
 * Withdrawal
 */
export const COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC =
  'collateral.withdrawal.submitted';
export const COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC =
  'collateral.withdrawal.updated';
export const COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC =
  'collateral.withdrawal.error';
export const INITIATE_COLLATERAL_WITHDRAWAL_COMMAND =
  'initiate.collateral.withdrawal';

/**
 * Liquidation
 */
export const COLLATERAL_LIQUIDATION_TRANSACTION_SUBMITTED_TOPIC =
  'collateral.liquidation.submitted';
export const COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC =
  'collateral.liquidation.updated';
export const COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC =
  'collateral.liquidation.error';
export const INITIATE_COLLATERAL_LIQUIDATION_COMMAND =
  'initiate.collateral.liquidation';

/**
 * Deposit
 */
export const COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC =
  'collateral.deposit.completed';
