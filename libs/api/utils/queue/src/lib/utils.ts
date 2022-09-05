import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueUtilService } from './queue-util.service';

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
  requeueOnError = true,
  exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
): AppliedDecorator {
  const queueSpecificRoutingKey = `${queueName}-${routingKey}`;

  const baseQueueOptions = {
    createQueueIfNotExists: true,
    queue: `${queueName}-${exchange}_${routingKey}`,
    errorHandler: createErrorHandler(
      queueSpecificRoutingKey,
      requeueOnError,
      exchange,
    ),
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange':
          QueueUtilService.getDeadLetterExchangeName(exchange),
        'x-dead-letter-routing-key': queueSpecificRoutingKey,
      },
    },
  };

  const decorators: MethodDecorator[] = <MethodDecorator[]>[
    RabbitSubscribe({
      exchange: exchange,
      routingKey: routingKey,
      ...baseQueueOptions,
    }),
    requeueOnError
      ? SetMetadata(RABBIT_RETRY_HANDLER, {
          type: 'subscribe',
          routingKey: queueSpecificRoutingKey,
          exchange: QueueUtilService.getRetryExchangeName(exchange),
          ...baseQueueOptions,
        })
      : undefined,
  ].filter((decorator) => decorator !== undefined);

  return applyDecorators(...decorators);
}

export function RequestHandler(
  routingKey: string,
  queueName: string,
  exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
): AppliedDecorator {
  const fullQueueName = `${queueName}-${exchange}_${routingKey}`;

  return applyDecorators(
    RabbitRPC({
      exchange,
      createQueueIfNotExists: true,
      queue: fullQueueName,
      routingKey: routingKey,
      queueOptions: {
        durable: true,
      },
    }),
  );
}

function createErrorHandler(
  queueSpecificRoutingKey: string,
  requeueOnError: boolean,
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
      payload: msg.content.toString(),
      error,
      requeue: requeueOnError,
      retryAttempt,
    });

    if (requeueOnError) {
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
