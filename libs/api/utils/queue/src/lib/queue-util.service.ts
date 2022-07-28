import { Injectable } from '@nestjs/common';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class QueueUtilService {
  public static GLOBAL_EXCHANGE = {
    name: 'archie.microservice.tx',
    type: 'topic',
  };

  public static createExchanges(exchanges: RabbitMQExchangeConfig[]) {
    return exchanges.flatMap((exchange: RabbitMQExchangeConfig) => {
      const retryExchange: RabbitMQExchangeConfig = {
        name: QueueUtilService.getRetryExchangeName(exchange.name),
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

  public static getRetryExchangeName(exchange: string) {
    return `${exchange}.retry`;
  }
}
