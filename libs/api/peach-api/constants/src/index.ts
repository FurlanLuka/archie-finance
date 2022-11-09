import { Event } from '@archie/api/utils/queue/events';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects/types';

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
  QUEUE_URL = 'QUEUE_URL',
  PEACH_API_KEY = 'PEACH_API_KEY',
  PEACH_BASE_URL = 'PEACH_BASE_URL',
  PEACH_COMPANY_ID = 'PEACH_COMPANY_ID',
  PEACH_BORROWER_ROLE_ID = 'PEACH_BORROWER_ROLE_ID',
  PEACH_LOAN_ID = 'PEACH_LOAN_ID',
  ENCRYPTION_KEY = 'ENCRYPTION_KEY',
  API_BASE_URL = 'API_BASE_URL',
  REDIS_URL = 'REDIS_URL',
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
}

export const CREDIT_BALANCE_UPDATED_TOPIC = new Event<CreditBalanceUpdatedPayload>('peach.credit_balance.updated', 1);

export const GET_LOAN_BALANCES_RPC = 'get.loan.balances.rpc';
