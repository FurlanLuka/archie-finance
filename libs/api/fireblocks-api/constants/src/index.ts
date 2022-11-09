import { Event } from '@archie/api/utils/queue/events';
import {
  CollateralDepositTransactionCompletedPayload,
  CollateralLiquidationTransactionErrorPayload,
  CollateralLiquidationTransactionSubmittedPayload,
  CollateralLiquidationTransactionUpdatedPayload,
  CollateralWithdrawalTransactionErrorPayload,
  CollateralWithdrawalTransactionSubmittedPayload,
  CollateralWithdrawalTransactionUpdatedPayload,
  InitiateCollateralLiquidationCommandPayload,
  InitiateCollateralWithdrawalCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects/types';

export const SERVICE_NAME = 'fireblocks-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  ASSET_LIST = 'ASSET_LIST',
  FIREBLOCKS_API_KEY = 'FIREBLOCKS_API_KEY',
  FIREBLOCKS_PRIVATE_KEY = 'FIREBLOCKS_PRIVATE_KEY',
  QUEUE_URL = 'QUEUE_URL',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
}

/**
 * Withdrawal
 */
export const COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC =
  new Event<CollateralWithdrawalTransactionSubmittedPayload>('collateral.withdrawal.submitted', 1);
export const COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC = new Event<CollateralWithdrawalTransactionUpdatedPayload>(
  'collateral.withdrawal.updated',
  1,
);
export const COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC = new Event<CollateralWithdrawalTransactionErrorPayload>(
  'collateral.withdrawal.error',
  1,
);
export const INITIATE_COLLATERAL_WITHDRAWAL_COMMAND = new Event<InitiateCollateralWithdrawalCommandPayload>(
  'initiate.collateral.withdrawal',
  1,
);

/**
 * Liquidation
 */
export const COLLATERAL_LIQUIDATION_TRANSACTION_SUBMITTED_TOPIC =
  new Event<CollateralLiquidationTransactionSubmittedPayload>('collateral.liquidation.submitted', 1);
export const COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC =
  new Event<CollateralLiquidationTransactionUpdatedPayload>('collateral.liquidation.updated', 1);
export const COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC = new Event<CollateralLiquidationTransactionErrorPayload>(
  'collateral.liquidation.error',
  1,
);
export const INITIATE_COLLATERAL_LIQUIDATION_COMMAND = new Event<InitiateCollateralLiquidationCommandPayload>(
  'initiate.collateral.liquidation',
  1,
);

/**
 * Deposit
 */
export const COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC = new Event<CollateralDepositTransactionCompletedPayload>(
  'collateral.deposit.completed',
  1,
);
