import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

export interface QueueOptions {
  useEventLog?: boolean;
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
