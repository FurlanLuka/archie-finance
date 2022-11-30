import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { QueueConstants } from './queue.constants';
import { Options } from 'amqplib';
import { RPCResponse, RPCResponseType } from './queue.interfaces';
import tracer, { Span } from 'dd-trace';
import { v4 } from 'uuid';
import { Event } from '../event/event';
import { LogService } from '../log/log.service';
import { RmqService } from 'nestjs-rabbit-messaging-queue';
import { RequestOptions } from 'nestjs-rabbit-messaging-queue';

@Injectable()
export class QueueService {
  constructor(
    private rmqService: RmqService,
    @Inject('USE_EVENT_LOG') private useEventLog: boolean,
    @Optional() private logService?: LogService,
  ) {}

  public publishEvent<T extends object>(
    event: Event<T>,
    message: T,
    exchange: string = QueueConstants.GLOBAL_EXCHANGE.name,
    options?: Options.Publish,
  ): void {
    const eventId = v4();
    const headers = {
      'event-id': eventId,
      ...options?.headers,
    };

    try {
      tracer.trace('queue_event_publish', (span: Span) => {
        span.setTag('resource.name', event.getRoutingKey());

        tracer.inject(span, 'text_map', headers);
      });
    } catch (error) {
      Logger.error('Failed adding event trace');
    }

    this.rmqService.publishEvent(event.getRoutingKey(), message, exchange, {
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
    exchange: string = QueueConstants.GLOBAL_EXCHANGE.name,
    options?: RequestOptions,
  ): Promise<K> {
    return tracer.trace('rpc_request', async (span: Span) => {
      span.setTag('resource.name', routingKey);
      const headers = options?.headers !== undefined ? options.headers : {};
      tracer.inject(span, 'text_map', headers);

      const response = await this.rmqService.request<RPCResponse<K>>(
        routingKey,
        payload,
        exchange,
        {
          exchange,
          routingKey,
          payload: payload,
          timeout: 10_000,
          ...options,
          headers,
        },
      );

      if (response.type === RPCResponseType.ERROR) {
        span.setTag('error', response.message);

        throw new Error(response.message);
      }

      return response.data;
    });
  }
}
