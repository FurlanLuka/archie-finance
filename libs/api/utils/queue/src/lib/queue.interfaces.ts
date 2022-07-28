import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

export interface RabbitOptions {
  exchanges?: RabbitMQExchangeConfig[];
}
