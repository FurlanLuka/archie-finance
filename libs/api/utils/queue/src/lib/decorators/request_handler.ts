import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators } from '@nestjs/common';
import { QueueUtilService } from '../queue/queue-util.service';
import { TraceEvent } from './trace_event';
import { AppliedDecorator } from './queue_decorators.interfaces';

export function RequestHandler(
  routingKey: string,
  queueName: string,
  exchange: string = QueueUtilService.GLOBAL_EXCHANGE.name,
): AppliedDecorator {
  const fullQueueName = `${queueName}-${exchange}_${routingKey}`;

  return applyDecorators(
    TraceEvent(fullQueueName, false),
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
