import { Event } from '@archie/api/utils/queue';
import {
  InitiateLedgerAssetLiquidationCommandPayload,
  InitiateLedgerRecalculationCommandPayload,
} from '@archie/api/ledger-api/data-transfer-objects';

export const SERVICE_NAME = 'ledger-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  ASSET_LIST = 'ASSET_LIST',
  QUEUE_URL = 'QUEUE_URL',
  COINGECKO_API_URI = 'COINGECKO_API_URI',
  REDIS_URL = 'REDIS_URL',
}

export const LEDGER_ACCOUNT_UPDATED_TOPIC = 'ledger.account.updated';

export const INITIATE_LEDGER_ASSET_LIQUIDATION_COMMAND =
  new Event<InitiateLedgerAssetLiquidationCommandPayload>(
    'initiate.ledger.asset.liquidation',
    1,
  );

export const INITIATE_LEDGER_RECALCULATION_COMMAND =
  new Event<InitiateLedgerRecalculationCommandPayload>(
    'initiate.ledger.recalculation',
    1,
  );
