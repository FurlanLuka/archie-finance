import { Inject, Logger } from '@nestjs/common';
import { DynamodbService } from '@archie-microservices/api/utils/dynamodb';

export function Idempotent(
  routingKey: string,
  queueName: string,
): MethodDecorator {
  const injector = Inject(DynamodbService);

  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    injector(target, 'dynamodbService');

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const requestMeta = args[1];
      const headers: object | undefined = requestMeta?.properties?.headers;
      const eventId: string | undefined = headers
        ? headers['event-id']
        : undefined;

      if (eventId) {
        try {
          const readRes = await this.dynamodbService.read(
            'event-idempotency',
            `${queueName}-${routingKey}-${eventId}`,
          );

          if (readRes === undefined) {
            await originalMethod.apply(this, args);
          } else {
            Logger.error(
              `Duplicate event detected for id: ${queueName}-${routingKey}-${eventId}`,
            );
          }
        } catch (err) {
          await originalMethod.apply(this, args);
        }
      } else {
        await originalMethod.apply(this, args);
      }

      if (eventId) {
        void this.dynamodbService.write('event-idempotency', {
          id: `${queueName}-${routingKey}-${eventId}`,
          timestamp: Date.now(),
        });
      }
    };
  };
}
