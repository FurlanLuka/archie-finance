import { applyDecorators } from '@nestjs/common';
import { QueueConstants } from '../queue/queue.constants';
import { TraceEvent } from './trace_event';
import { Idempotent } from './idempotent';
import { Event } from '../event/event';
import { AppliedDecorator } from './queue_decorators.interfaces';
import { Subscribe as RabbitSubscribe } from 'nestjs-rabbit-messaging-queue';

interface SubscriptionOptions {
  useTracer: boolean;
  requeueOnError: boolean;
  useIdempotency: boolean;
  exchange: string;
  autoDelete: boolean;
}

export function Subscribe(
  event: Event<unknown>,
  queueName: string,
  options?: Partial<SubscriptionOptions>,
): AppliedDecorator {
  const subscriptionOptions: SubscriptionOptions = {
    useTracer: options?.useTracer ?? true,
    requeueOnError: options?.requeueOnError ?? true,
    useIdempotency: options?.useIdempotency ?? true,
    exchange: options?.exchange ?? QueueConstants.GLOBAL_EXCHANGE.name,
    autoDelete: options?.autoDelete ?? false,
  };

  const routingKey = event.getRoutingKey();
  const fullQueueName = `${queueName}-${subscriptionOptions.exchange}_${routingKey}`;

  const decorators: MethodDecorator[] = [];

  if (subscriptionOptions.useTracer) {
    decorators.push(TraceEvent(fullQueueName, !event.getOptions().isSensitive));
  }

  if (subscriptionOptions.useIdempotency) {
    decorators.push(Idempotent(routingKey, fullQueueName));
  }

  decorators.push(
    RabbitSubscribe(routingKey, fullQueueName, {
      exchange: subscriptionOptions.exchange,
      onError: {
        retry: subscriptionOptions.requeueOnError,
        deadLetter: subscriptionOptions.requeueOnError,
      },
      queue: {
        durable: true,
        autoDelete: subscriptionOptions.autoDelete,
      },
    }),
  );

  return applyDecorators(...decorators);
}
