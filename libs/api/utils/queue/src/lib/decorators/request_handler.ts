import { applyDecorators } from '@nestjs/common';
import { QueueConstants } from '../queue/queue.constants';
import { TraceEvent } from './trace_event';
import { AppliedDecorator } from './queue_decorators.interfaces';
import { Rpc } from 'nestjs-rabbit-messaging-queue';

export function RequestHandler(
  routingKey: string,
  queueName: string,
  exchange: string = QueueConstants.GLOBAL_EXCHANGE.name,
): AppliedDecorator {
  const fullQueueName = `${queueName}-${exchange}_${routingKey}`;

  return applyDecorators(
    TraceEvent(fullQueueName, false),
    Rpc(routingKey, fullQueueName, exchange, {
      durable: true,
    }),
  );
}
