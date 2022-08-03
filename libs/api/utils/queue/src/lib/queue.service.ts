import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitHandlerConfig,
  RequestOptions,
} from '@golevelup/nestjs-rabbitmq';
import { QueueUtilService } from './queue-util.service';
import { Options } from 'amqplib';
import { RPCResponse, RPCResponseType } from './queue.interfaces';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { RABBIT_RETRY_HANDLER } from './utils';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    private amqpConnection: AmqpConnection,
    private discover: DiscoveryService,
  ) {}

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
      payload: payload,
      timeout: 10_000,
      ...options,
    });

    if (response.type === RPCResponseType.ERROR) {
      throw new Error(response.message);
    }

    return response.data;
  }

  async onModuleInit() {
    const retryHandlers = [
      ...(await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
      ...(await this.discover.controllerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
    ];
    retryHandlers.forEach(({ discoveredMethod, meta }) => {
      const handler = discoveredMethod.handler.bind(
        discoveredMethod.parentClass.instance,
      );

      this.amqpConnection.createSubscriber(
        handler,
        meta,
        discoveredMethod.methodName,
      );
      this.createDeadLetterQueue(meta);
    });
  }

  private createDeadLetterQueue(meta: RabbitHandlerConfig) {
    const { queue } = this.amqpConnection.channel.assertQueue(
      QueueUtilService.getDeadLetterQueueName(meta.queue),
      {
        durable: true,
      },
    );
    this.amqpConnection.channel.bindQueue(
      queue,
      meta.queueOptions.arguments['x-dead-letter-exchange'],
      meta.queueOptions.arguments['x-dead-letter-routing-key'],
    );
  }
}
