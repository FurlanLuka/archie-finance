export const SERVICE_NAME = 'webhook-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  QUEUE_URL = 'QUEUE_URL',
  PEACH_BASE_URL = 'PEACH_BASE_URL',
  PEACH_API_KEY = 'PEACH_API_KEY',
  FIREBLOCKS_PUBLIC_KEY = 'FIREBLOCKS_PUBLIC_KEY',
}

export const WEBHOOK_PEACH_PAYMENT_CONFIRMED_TOPIC =
  'webhook_peach.payment.confirmed';

export const WEBHOOK_FIREBLOCKS_DEPOSIT_TRANSACTION_TOPIC =
  'webhook.fireblocks.deposit.transaction';
export const WEBHOOK_FIREBLOCKS_WITHDRAWAL_TRANSACTION_TOPIC =
  'webhook.fireblocks.withdrawal.transaction';
export const WEBHOOK_FIREBLOCKS_INTERNAL_TRANSACTION_TOPIC =
  'webhook.fireblocks.internal.transaction';
