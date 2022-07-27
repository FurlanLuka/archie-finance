import {
  RabbitMQExchangeConfig,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger } from '@nestjs/common';
import { defaultNackErrorHandler } from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueService } from './queue.service';

const INITIAL_DELAY = 20000;
const MAX_RETRIES = 10;

export function Subscribe(
  exchange: RabbitMQExchangeConfig,
  queueName: string,
  requeueOnError = true,
) {
  const decorators = [
    RabbitSubscribe({
      exchange: exchange.name,
      createQueueIfNotExists: true,
      queue: `${queueName}_${exchange.name}`,
      routingKey: '',
      queueOptions: {
        durable: true,
      },
      errorHandler: createErrorHandler(exchange, queueName, requeueOnError),
    }),
    requeueOnError
      ? RabbitSubscribe({
          exchange: `${exchange.name}.retry`,
          createQueueIfNotExists: true,
          queue: `${queueName}_${exchange.name}`,
          routingKey: queueName,
          queueOptions: {
            durable: true,
          },
          errorHandler: createErrorHandler(exchange, queueName, requeueOnError),
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
      const delay: number = headers['x-delay'] ?? INITIAL_DELAY / 2;

      if (retryAttempt < MAX_RETRIES) {
        channel.publish(
          QueueService.getRetryExchangeName(exchange),
          queueName,
          msg.content,
          {
            headers: {
              'x-delay': delay * 2,
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
