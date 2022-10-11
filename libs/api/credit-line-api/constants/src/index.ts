import { Event } from '@archie/api/utils/queue';
import {
  CreditLineCreatedPayload,
  CreditLineUpdatedPayload,
} from '@archie/api/credit-line-api/data-transfer-objects';

export const SERVICE_NAME = 'credit-line-api';
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
  ASSET_LIST = 'ASSET_LIST',
}

export const CREDIT_LINE_CREATED_TOPIC = new Event<CreditLineCreatedPayload>(
  'credit_line.created',
  1,
);
export const CREDIT_LINE_UPDATED_TOPIC = new Event<CreditLineUpdatedPayload>(
  'credit_line.updated',
  1,
);
