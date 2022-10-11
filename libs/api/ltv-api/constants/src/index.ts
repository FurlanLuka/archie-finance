import { Event } from '@archie/api/utils/queue';
import {
  MarginCallCompletedPayload,
  MarginCallLtvLimitApproachingPayload,
  MarginCallStartedPayload,
} from '@archie/api/ltv-api/data-transfer-objects';

export const SERVICE_NAME = 'ltv-api';
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
  REDIS_URL = 'REDIS_URL',
}

export const COLLATERAL_SALE_LTV_LIMIT = 90;
export const LTV_MARGIN_CALL_LIMIT = 75;
export const LIQUIDATION_TARGET_LTV = 60;
export const MARGIN_CALL_LIQUIDATION_AFTER_HOURS = 72;

export const MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC =
  new Event<MarginCallLtvLimitApproachingPayload>(
    'margin.margin_call.ltv_limit_approaching',
    1,
  );
export const MARGIN_CALL_COMPLETED_TOPIC =
  new Event<MarginCallCompletedPayload>('margin.margin_call.completed', 1);
export const MARGIN_CALL_STARTED_TOPIC = new Event<MarginCallStartedPayload>(
  'margin.margin_call.started',
  1,
);
