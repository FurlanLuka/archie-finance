import { Injectable } from '@nestjs/common';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class QueueService {
  public createExchanges(exchanges: RabbitMQExchangeConfig[]) {
    return exchanges.flatMap((exchange: RabbitMQExchangeConfig) => {
      const retryExchange: RabbitMQExchangeConfig = {
        name: QueueService.getRetryExchangeName(exchange),
        type: 'x-delayed-message',
        options: {
          arguments: {
            'x-delayed-type': 'direct',
          },
        },
      };

      return [exchange, retryExchange];
    });
  }

  public static getRetryExchangeName(exchange: RabbitMQExchangeConfig) {
    return `${exchange.name}.retry`;
  }
}
