import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Optional,
} from '@nestjs/common';
import {
  AmqpConnection,
  RabbitHandlerConfig,
  RequestOptions,
} from '@golevelup/nestjs-rabbitmq';
import { QueueUtilService } from './queue-util.service';
import { Options } from 'amqplib';
import { RPCResponse, RPCResponseType } from './queue.interfaces';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { RABBIT_RETRY_HANDLER } from '../decorators/subscribe';
import tracer, { Span } from 'dd-trace';
import { v4 } from 'uuid';
import { Event } from '../event/event';
import { LogService } from '../log/log.service';

@Injectable()
export class QueueService implements OnApplicationBootstrap {
  constructor(
    private amqpConnection: AmqpConnection,
    private discover: DiscoveryService,
    @Inject('USE_EVENT_LOG') private useEventLog: boolean,
    @Optional() private logService?: LogService,
  ) {}

  public publishEvent<T extends object>(
    event: Event<T>,
    message: T,
    exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
    options?: Options.Publish,
  ): void {
    const eventId = v4();

    const headers = {
      'event-id': eventId,
      ...options?.headers,
    };

    try {
      tracer.trace('queue_event_publish', (span: Span) => {
        span.setTag('eventName', event.getRoutingKey());

        tracer.inject(span, 'text_map', headers);
      });
    } catch (error) {
      Logger.error('Failed adding event trace');
    }

    this.amqpConnection.publish(exchange, event.getRoutingKey(), message, {
      ...options,
      headers,
    });

    if (this.useEventLog) {
      const eventLogId = `${event.getRoutingKey()}-${eventId}-${exchange}`;

      void this.logService?.writeEventLog(eventLogId, message);
    }
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

  async onApplicationBootstrap(): Promise<void> {
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
