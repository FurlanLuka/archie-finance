import { v4 } from 'uuid';

export const SERVICE_NAME = 'websocket-event-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;
export const SERVICE_INSTANCE_ID = v4();

export enum ConfigVariables {
  QUEUE_URL = 'QUEUE_URL',
  REDIS_URL = 'REDIS_URL',
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
}
