import { Event } from '@archie/api/utils/queue/events';
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

export const INITIATE_LEDGER_RECALCULATION_SCHEDULER = new Event(
  'initiate.ledger.recalculation.scheduler',
  1,
);
