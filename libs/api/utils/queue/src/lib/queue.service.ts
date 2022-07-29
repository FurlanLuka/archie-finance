import { Injectable } from '@nestjs/common';
import { AmqpConnection, RequestOptions } from '@golevelup/nestjs-rabbitmq';
import { QueueUtilService } from './queue-util.service';
import { Options } from 'amqplib';
import { RPCResponse, RPCResponseType } from './queue.interfaces';

@Injectable()
export class QueueService {
  constructor(private amqpConnection: AmqpConnection) {}

  public publish<T>(
    routingKey: string,
    message: T,
    exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
    options?: Options.Publish,
  ) {
    this.amqpConnection.publish(exchange, routingKey, message, options);
  }

  public async request<K = object, T extends object = object>(
    routingKey: string,
    payload: T = {} as T,
    exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
    options?: RequestOptions,
  ): Promise<K> {
    const response = await this.amqpConnection.request<RPCResponse<K>>({
      exchange,
      routingKey,
      payload,
      timeout: 10_000,
      ...options,
    });

    if (response.type === RPCResponseType.ERROR) {
      throw new Error(response.message);
    }

    return response.data;
  }
}
