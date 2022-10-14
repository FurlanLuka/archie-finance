import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { applyDecorators, Logger, SetMetadata } from '@nestjs/common';
import {
  ackErrorHandler,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq/lib/amqp/errorBehaviors';
import { Channel, ConsumeMessage } from 'amqplib';
import { QueueUtilService } from './queue-util.service';
import tracer, { Span } from 'dd-trace';

// eslint-disable-next-line @typescript-eslint/ban-types
type AppliedDecorator = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

const INITIAL_DELAY = 20000;
const MAX_RETRIES = 5;
const RETRY_BACKOFF = 2;

export const RABBIT_RETRY_HANDLER = 'RABBIT_RETRY_HANDLER';

interface SubscriptionOptions {
  logBody?: boolean;
  requeueOnError?: boolean;
}

interface DefinedSubscriptionOptions {
  logBody: boolean;
  requeueOnError: boolean;
}

export function Subscribe(
  routingKey: string,
  queueName: string,
  options: SubscriptionOptions = {
    logBody: true,
    requeueOnError: true,
  },
  exchange = QueueUtilService.GLOBAL_EXCHANGE.name,
): AppliedDecorator {
  const subscriptionOptions: DefinedSubscriptionOptions = {
    logBody: options.logBody ?? true,
    requeueOnError: options.requeueOnError ?? true,
  };

  const queueSpecificRoutingKey = `${queueName}-${routingKey}`;
  const queue = `${queueName}-${exchange}_${routingKey}`;

  const baseQueueOptions = {
    createQueueIfNotExists: true,
    queue,
    errorHandler: createErrorHandler(
      queueSpecificRoutingKey,
      subscriptionOptions,
      exchange,
    ),
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange':
          QueueUtilService.getDeadLetterExchangeName(exchange),
        'x-dead-letter-routing-key': queueSpecificRoutingKey,
      },
    },
  };

  const decorators: MethodDecorator[] = <MethodDecorator[]>[
    TraceEvent(queue, subscriptionOptions.logBody),
    RabbitSubscribe({
      exchange: exchange,
      routingKey: routingKey,
      ...baseQueueOptions,
    }),
    subscriptionOptions.requeueOnError
      ? SetMetadata(RABBIT_RETRY_HANDLER, {
          type: 'subscribe',
          routingKey: queueSpecificRoutingKey,
          exchange: QueueUtilService.getRetryExchangeName(exchange),
          ...baseQueueOptions,
        })
      : undefined,
  ].filter((decorator) => decorator !== undefined);

  return applyDecorators(...decorators);
}

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

function createErrorHandler(
  queueSpecificRoutingKey: string,
  options: DefinedSubscriptionOptions,
  exchange: string,
): (
  channel: Channel,
  msg: ConsumeMessage,
  error: unknown,
) => void | Promise<void> {
  return (channel: Channel, msg: ConsumeMessage, error) => {
    const originalHeaders = msg.properties.headers;
    const retryAttempt: number = originalHeaders['x-retry'] ?? 0;

    Logger.error({
      message: `Event handling failed for routing key "${queueSpecificRoutingKey}"`,
      payload: options.logBody ? msg.content.toString() : undefined,
      error,
      requeue: options.requeueOnError,
      retryAttempt,
    });

    if (options.requeueOnError) {
      const delay: number =
        originalHeaders['x-delay'] ?? INITIAL_DELAY / RETRY_BACKOFF;

      if (retryAttempt < MAX_RETRIES) {
        const retryHeaders = {
          ...originalHeaders,
          'x-delay': delay * RETRY_BACKOFF,
          'x-retry': retryAttempt + 1,
        };

        channel.publish(
          QueueUtilService.getRetryExchangeName(exchange),
          queueSpecificRoutingKey,
          msg.content,
          {
            headers: retryHeaders,
          },
        );
      } else {
        return pushToDeadLetterQueue(channel, msg, error);
      }
    }

    return ackErrorHandler(channel, msg, error);
  };
}

function pushToDeadLetterQueue(
  channel: Channel,
  msg: ConsumeMessage,
  error,
): void | Promise<void> {
  return defaultNackErrorHandler(channel, msg, error);
}

export function TraceEvent(
  queueName: string,
  logBody: boolean,
): MethodDecorator {
  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const requestMeta = args[1];
      const requestPayload = args[0];
      const headers: object | undefined = requestMeta?.properties?.headers;
      const childOf = tracer.extract('text_map', headers);

      return tracer.trace(
        queueName,
        {
          childOf: childOf ?? undefined,
        },
        async (span: Span) => {
          const payloadToLog = logBody ? requestPayload : null;
          Logger.log({
            message: `New event on queue ${queueName} received`,
            payload: payloadToLog,
          });

          span.setTag('payload', payloadToLog);
          try {
            const response = await originalMethod.apply(this, args);
            return response;
          } catch (error) {
            span.setTag('error', error);
            throw error;
          }
        },
      );
    };
  };
}
