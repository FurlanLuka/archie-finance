import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { QueueUtilService } from './queue-util.service';
import { Options } from 'amqplib';

@Injectable()
export class QueueService {
  constructor(private amqpConnection: AmqpConnection) {}

  public publish<T>(
    routingKey: string,
    message: T,
    exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
    options?: Options.Publish,
  ) {
    this.amqpConnection.publish(exchange, routingKey, message, options);
  }
}
