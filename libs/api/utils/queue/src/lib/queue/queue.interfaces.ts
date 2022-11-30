import { RabbitMQExchange } from 'nestjs-rabbit-messaging-queue';

export interface QueueOptions {
  useEventLog?: boolean;
  exchanges?: RabbitMQExchange[];
}

export enum RPCResponseType {
  SUCCESS = 0,
  ERROR = 1,
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
