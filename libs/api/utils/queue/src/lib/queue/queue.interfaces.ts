import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

interface DynamoLogOptions {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  idempotencyTableName: string;
  eventLogTableName: string;
}

export interface QueueConfig {
  dynamoLogOptions?: DynamoLogOptions;
}

export interface QueueOptions {
  includeDynamoDB?: boolean;
  exchanges?: RabbitMQExchangeConfig[];
}

export enum RPCResponseType {
  SUCCESS,
  ERROR,
}

interface RPCSuccessResponse<T> {
  type: RPCResponseType.SUCCESS;
  data: T;
}

interface RPCErrorResponse {
  type: RPCResponseType.ERROR;
  message: string;
}

export type RPCResponse<T> = RPCSuccessResponse<T> | RPCErrorResponse;
