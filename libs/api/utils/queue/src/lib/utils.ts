import {
  RabbitMQExchangeConfig,
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger } from '@nestjs/common';
import { defaultNackErrorHandler } from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';

export function Subscribe(
  exchange: RabbitMQExchangeConfig,
  queueName: string,
  requeueOnError = false,
) {
  return applyDecorators(
    RabbitSubscribe({
      exchange: exchange.name,
      createQueueIfNotExists: true,
      queue: `${queueName}_${exchange.name}`,
      routingKey: '',
      queueOptions: {
        durable: true,
      },
      errorHandler: (channel: Channel, msg: ConsumeMessage, error) => {
        Logger.error({
          message: 'Event handling failed',
          payload: msg.content.toString(),
          error,
          requeue: requeueOnError,
        });

        if (requeueOnError) {
          return requeueErrorHandler(channel, msg, error);
        }

        return defaultNackErrorHandler(channel, msg, error);
      },
    }),
  );
}
