import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueUtilService } from './queue-util.service';

const INITIAL_DELAY = 20000;
const MAX_RETRIES = 5;
const RETRY_BACKOFF = 2;

export const RABBIT_RETRY_HANDLER = 'RABBIT_RETRY_HANDLER';

export function Subscribe(
  routingKey: string,
  queueName: string,
  requeueOnError = true,
  exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
) {
  const baseQueueOptions = {
    createQueueIfNotExists: true,
    queue: `${queueName}-${exchange}_${routingKey}`,
    errorHandler: createErrorHandler(routingKey, requeueOnError, exchange),
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange':
          QueueUtilService.getDeadLetterExchangeName(exchange),
        'x-dead-letter-routing-key': routingKey,
      },
    },
  };

  const decorators = [
    RabbitSubscribe({
      exchange: exchange,
      routingKey: routingKey,
      ...baseQueueOptions,
    }),
    requeueOnError
      ? SetMetadata(RABBIT_RETRY_HANDLER, {
          type: 'subscribe',
          routingKey: routingKey,
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
) {
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
  routingKey: string,
  requeueOnError: boolean,
  exchange: string,
) {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const headers = msg.properties.headers;
    const retryAttempt: number = headers['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for routing key "${routingKey}"`,
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
          routingKey,
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

function pushToDeadLetterQueue(channel: Channel, msg: ConsumeMessage, error) {
  return defaultNackErrorHandler(channel, msg, error);
}
