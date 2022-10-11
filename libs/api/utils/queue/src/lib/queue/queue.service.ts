import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitHandlerConfig,
  RequestOptions,
} from '@golevelup/nestjs-rabbitmq';
import { QueueUtilService } from './queue-util.service';
import { Options } from 'amqplib';
import { RPCResponse, RPCResponseType } from './queue.interfaces';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { RABBIT_RETRY_HANDLER } from '../utils';
import tracer, { Span } from 'dd-trace';

@Injectable()
export class QueueService implements OnApplicationBootstrap {
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
    tracer.trace('queue_event_publish', (span: Span) => {
      span.setTag('eventName', routingKey);
      const headers = options?.headers !== undefined ? options.headers : {};
      tracer.inject(span, 'text_map', headers);

      this.amqpConnection.publish(exchange, routingKey, message, {
        ...options,
        headers,
      });
    });
  }


  public async request<K = object, T extends object = object>(
    routingKey: string,
    payload: T = {} as T,
    exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
    options?: RequestOptions,
  ): Promise<K> {
    return tracer.trace('rpc_request', async (span: Span) => {
      span.setTag('eventName', routingKey);
      const headers = options?.headers !== undefined ? options.headers : {};
      tracer.inject(span, 'text_map', headers);

      const response = await this.amqpConnection.request<RPCResponse<K>>({
        exchange,
        routingKey,
        payload: payload,
        timeout: 10_000,
        ...options,
        headers,
      });

      if (response.type === RPCResponseType.ERROR) {
        span.setTag('error', response.message);

        throw new Error(response.message);
      }

      return response.data;
    });
  }

  async onApplicationBootstrap() {
    Logger.log('Initializing retry and dead letter queues');
    const retryHandlers = [
      ...(await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
      ...(await this.discover.controllerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
    ];
    await Promise.all(
      retryHandlers.map(async ({ discoveredMethod, meta }) => {
        const handler = discoveredMethod.handler.bind(
          discoveredMethod.parentClass.instance,
        );

        await this.amqpConnection.createSubscriber(
          handler,
          meta,
          discoveredMethod.methodName,
        );
        this.createDeadLetterQueue(meta);
      }),
    );
    Logger.log('Retry and dead letter queues initialized');
  }

  private createDeadLetterQueue(meta: RabbitHandlerConfig): void {
    if (meta.queue === undefined || meta.queueOptions === undefined) {
      Logger.error(
        'Invalid queue configuration. queue or queueOptions are not missing',
      );
      return;
    }

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
