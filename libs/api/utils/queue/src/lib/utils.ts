import {
  RabbitMQExchangeConfig,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import { defaultNackErrorHandler } from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueService } from './queue.service';

const INITIAL_DELAY = 20000;
const MAX_RETRIES = 5;
const RETRY_BACKOFF = 2;
export const RABBIT_RETRY_HANDLER = 'RABBIT_RETRY_HANDLER';

export function Subscribe(
  exchange: RabbitMQExchangeConfig,
  queueName: string,
  requeueOnError = true,
) {
  const baseQueueOptions = {
    createQueueIfNotExists: true,
    queue: `${queueName}_${exchange.name}`,
    queueOptions: {
      durable: true,
    },
    errorHandler: createErrorHandler(exchange, queueName, requeueOnError),
  };

  const decorators = [
    RabbitSubscribe({
      exchange: exchange.name,
      routingKey: '',
      ...baseQueueOptions,
    }),
    requeueOnError
      ? SetMetadata(RABBIT_RETRY_HANDLER, {
          type: 'subscribe',
          routingKey: queueName,
          exchange: QueueService.getRetryExchangeName(exchange),
          ...baseQueueOptions,
        })
      : undefined,
  ].filter((decorator) => decorator !== undefined);

  return applyDecorators(...decorators);
}

function createErrorHandler(
  exchange: RabbitMQExchangeConfig,
  queueName: string,
  requeueOnError: boolean,
) {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const headers = msg.properties.headers;
    const retryAttempt: number = headers['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for exchange "${exchange.name}"`,
      payload: msg.content.toString(),
      error,
      requeue: requeueOnError,
      retryAttempt,
    });

    if (requeueOnError) {
      const delay: number = headers['x-delay'] ?? INITIAL_DELAY / RETRY_BACKOFF;

      if (retryAttempt < MAX_RETRIES) {
        channel.publish(
          QueueService.getRetryExchangeName(exchange),
          queueName,
          msg.content,
          {
            headers: {
              'x-delay': delay * RETRY_BACKOFF,
              'x-retry': retryAttempt + 1,
            },
          },
        );
      } else {
        // TODO: push to dead letter queue
      }
    }

    return defaultNackErrorHandler(channel, msg, error);
  };
}
