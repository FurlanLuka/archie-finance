import { Event } from '@archie/api/utils/queue';
import {
  FireblocksDepositTransactionPayload,
  FireblocksInternalTransactionPayload,
  FireblocksWithdrawTransactionPayload,
  PeachPaymentUpdatedPayload,
} from '@archie/api/webhook-api/data-transfer-objects';

export const SERVICE_NAME = 'webhook-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  QUEUE_URL = 'QUEUE_URL',
  FIREBLOCKS_PUBLIC_KEY = 'FIREBLOCKS_PUBLIC_KEY',
  PEACH_HMAC_SECRET = 'PEACH_HMAC_SECRET',
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
  AUTH0_WEBHOOK_SECRET = 'AUTH0_WEBHOOK_SECRET',
}

export const WEBHOOK_PEACH_PAYMENT_UPDATED_TOPIC =
  new Event<PeachPaymentUpdatedPayload>('webhook_peach.payment.updated', 1);

export const WEBHOOK_FIREBLOCKS_DEPOSIT_TRANSACTION_TOPIC =
  new Event<FireblocksDepositTransactionPayload>(
    'webhook.fireblocks.deposit.transaction',
    1,
  );
export const WEBHOOK_FIREBLOCKS_WITHDRAWAL_TRANSACTION_TOPIC =
  new Event<FireblocksWithdrawTransactionPayload>(
    'webhook.fireblocks.withdrawal.transaction',
    1,
  );
export const WEBHOOK_FIREBLOCKS_INTERNAL_TRANSACTION_TOPIC =
  new Event<FireblocksInternalTransactionPayload>(
    'webhook.fireblocks.internal.transaction',
    1,
  );
