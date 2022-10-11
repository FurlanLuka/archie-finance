import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueUtilService } from '../queue/queue-util.service';
import { LogEvent } from './log_event';
import { Idempotent } from './idempotent';

interface SubscriptionOptions {
  useLogger: boolean;
  logBody: boolean;
  requeueOnError: boolean;
  useIdempotency: boolean;
  useEventSourcing: boolean;
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
  routingKey: string,
  queueName: string,
  options?: Partial<SubscriptionOptions>,
): AppliedDecorator {
  const subscriptionOptions: SubscriptionOptions = {
    useLogger: options?.useLogger ?? true,
    logBody: options?.logBody ?? true,
    requeueOnError: options?.requeueOnError ?? true,
    useIdempotency: options?.useIdempotency ?? true,
    useEventSourcing: options?.useEventSourcing ?? false,
    exchange: options?.exchange ?? QueueUtilService.GLOBAL_EXCHANGE.name,
  };

  const queueSpecificRoutingKey = `${queueName}-${routingKey}`;
  const fullQueueName = `${queueName}-${subscriptionOptions.exchange}_${routingKey}`;

  const baseQueueOptions = {
    createQueueIfNotExists: true,
    queue: fullQueueName,
    errorHandler: createErrorHandler(
      queueSpecificRoutingKey,
      subscriptionOptions,
      subscriptionOptions.exchange,
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

  const decorators: MethodDecorator[] = [
    RabbitSubscribe({
      exchange: subscriptionOptions.exchange,
      routingKey: routingKey,
      ...baseQueueOptions,
    }),
  ];

  if (subscriptionOptions.useLogger) {
    decorators.push(LogEvent(fullQueueName, subscriptionOptions.logBody));
  }

  if (subscriptionOptions.useIdempotency) {
    decorators.push(Idempotent(routingKey, fullQueueName));
  }

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
): (
  channel: Channel,
  msg: ConsumeMessage,
  error: unknown,
) => void | Promise<void> {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const headers = msg.properties.headers;
    const retryAttempt: number = headers['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for routing key "${queueSpecificRoutingKey}"`,
      payload: options.useLogger ? msg.content.toString() : undefined,
      error,
      requeue: options.requeueOnError,
      retryAttempt,
    });

    if (options.requeueOnError) {
      const delay: number = headers['x-delay'] ?? INITIAL_DELAY / RETRY_BACKOFF;

      if (retryAttempt < MAX_RETRIES) {
        channel.publish(
          QueueUtilService.getRetryExchangeName(exchange),
          queueSpecificRoutingKey,
          msg.content,
          {
            headers: {
              'x-delay': delay * RETRY_BACKOFF,
              'x-retry': retryAttempt + 1,
            },
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
