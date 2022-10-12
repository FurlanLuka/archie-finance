import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueUtilService } from '../queue/queue-util.service';
import { TraceEvent } from './trace_event';
import { Idempotent } from './idempotent';
import tracer from 'dd-trace';
import { Event } from '../event/event';

interface SubscriptionOptions {
  useTracer: boolean;
  requeueOnError: boolean;
  useIdempotency: boolean;
  exchange: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type AppliedDecorator = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

const INITIAL_DELAY = 20000;
const MAX_RETRIES = 5;
const RETRY_BACKOFF = 2;

export const RABBIT_RETRY_HANDLER = 'RABBIT_RETRY_HANDLER';

export function Subscribe(
  event: Event<any>,
  queueName: string,
  options?: Partial<SubscriptionOptions>,
): AppliedDecorator {
  const subscriptionOptions: SubscriptionOptions = {
    useTracer: options?.useTracer ?? true,
    requeueOnError: options?.requeueOnError ?? true,
    useIdempotency: options?.useIdempotency ?? true,
    exchange: options?.exchange ?? QueueUtilService.GLOBAL_EXCHANGE.name,
  };

  const routingKey = event.getRoutingKey();
  const queueSpecificRoutingKey = `${queueName}-${routingKey}`;
  const fullQueueName = `${queueName}-${subscriptionOptions.exchange}_${routingKey}`;

  const baseQueueOptions = {
    createQueueIfNotExists: true,
    queue: fullQueueName,
    errorHandler: createErrorHandler(
      queueSpecificRoutingKey,
      subscriptionOptions,
      subscriptionOptions.exchange,
      event.getOptions().isSensitive,
    ),
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': QueueUtilService.getDeadLetterExchangeName(
          subscriptionOptions.exchange,
        ),
        'x-dead-letter-routing-key': queueSpecificRoutingKey,
      },
    },
  };

  const decorators: MethodDecorator[] = [];

  if (subscriptionOptions.useTracer) {
    decorators.push(TraceEvent(fullQueueName, event.getOptions().isSensitive));
  }

  if (subscriptionOptions.useIdempotency) {
    decorators.push(Idempotent(routingKey, fullQueueName));
  }

  decorators.push(
    RabbitSubscribe({
      exchange: subscriptionOptions.exchange,
      routingKey: routingKey,
      ...baseQueueOptions,
    }),
  );

  if (subscriptionOptions.requeueOnError) {
    decorators.push(
      SetMetadata(RABBIT_RETRY_HANDLER, {
        type: 'subscribe',
        routingKey: queueSpecificRoutingKey,
        exchange: QueueUtilService.getRetryExchangeName(
          subscriptionOptions.exchange,
        ),
        ...baseQueueOptions,
      }),
    );
  }

  return applyDecorators(...decorators);
}

function createErrorHandler(
  queueSpecificRoutingKey: string,
  options: SubscriptionOptions,
  exchange: string,
  isSensitive: boolean,
): (
  channel: Channel,
  msg: ConsumeMessage,
  error: unknown,
) => void | Promise<void> {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const messageHeaders = msg.properties.headers;
    const retryAttempt: number = messageHeaders['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for routing key "${queueSpecificRoutingKey}"`,
      payload: isSensitive ? msg.content.toString() : undefined,
      error,
      requeue: options.requeueOnError,
      retryAttempt,
    });

    if (options.requeueOnError) {
      const delay: number =
        messageHeaders['x-delay'] ?? INITIAL_DELAY / RETRY_BACKOFF;

      if (retryAttempt < MAX_RETRIES) {
        const span = tracer.scope().active();
        const headers = {
          'x-delay': delay * RETRY_BACKOFF,
          'x-retry': retryAttempt + 1,
          'event-id': messageHeaders['event-id'],
        };

        if (span !== null) {
          tracer.inject(span, 'text_map', headers);
        }

        channel.publish(
          QueueUtilService.getRetryExchangeName(exchange),
          queueSpecificRoutingKey,
          msg.content,
          {
            headers,
          },
        );
      } else {
        return pushToDeadLetterQueue(channel, msg, error);
      }
    }

    return ackErrorHandler(channel, msg, error);
  };
}

function pushToDeadLetterQueue(
  channel: Channel,
  msg: ConsumeMessage,
  error,
): void | Promise<void> {
  return defaultNackErrorHandler(channel, msg, error);
}
