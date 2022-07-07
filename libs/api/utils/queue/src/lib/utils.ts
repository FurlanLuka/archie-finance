import {
  RabbitMQExchangeConfig,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators } from '@nestjs/common';

export function Subscribe(exchange: RabbitMQExchangeConfig, queueName: string) {
  return applyDecorators(
    RabbitSubscribe({
      exchange: exchange.name,
      createQueueIfNotExists: true,
      queue: `${queueName}_${exchange.name}`,
      routingKey: '',
      queueOptions: {
        durable: true,
      },
    }),
  );
}
