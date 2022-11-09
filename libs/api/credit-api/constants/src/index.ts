import { Event } from '@archie/api/utils/queue/events';
import { CardActivatedPayload, TransactionUpdatedPayload } from '@archie/api/credit-api/data-transfer-objects/types';

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
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
}

export const CARD_ACTIVATED_TOPIC = new Event<CardActivatedPayload>('credit.card.activated', 1);

export const TRANSACTION_UPDATED_TOPIC = new Event<TransactionUpdatedPayload>('credit.transaction.updated', 1);
