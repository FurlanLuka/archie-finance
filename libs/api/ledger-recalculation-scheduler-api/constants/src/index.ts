import { Event } from '@archie/api/utils/queue/events';
import { BatchRecalculationCompletedPayload } from '@archie/api/ledger-recalculation-scheduler-api/data-transfer-objects/types';

export const SERVICE_NAME = 'ledger-recalculation-scheduler-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  QUEUE_URL = 'QUEUE_URL',
  RUN_MIGRATIONS = 'RUN_MIGRATIONS',
}

export const INITIATE_BATCH_RECALCULATION = new Event(
  'initiate.ledger.recalculation.batch',
  1,
);
export const BATCH_RECALCULATION_COMPLETED =
  new Event<BatchRecalculationCompletedPayload>(
    'batch.recalculation.completed',
    1,
  );

export const LOW_LTV = 30;
export const MEDIUM_LTV = 50;
export const HIGH_LTV = 70;
