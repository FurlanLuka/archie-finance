import { Inject, Logger } from '@nestjs/common';
import { LogService } from '../log/log.service';

export function Idempotent(
  routingKey: string,
  queueName: string,
): MethodDecorator {
  const injector = Inject(LogService);

  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    injector(target, 'logService');

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const requestMeta = args[1];
      const headers: object | undefined = requestMeta?.properties?.headers;
      const eventId: string | undefined = headers
        ? headers['event-id']
        : undefined;

      let keyExists = false;

      if (eventId) {
        try {
          keyExists = await this.logService.idempotencyKeyExists(
            `${queueName}-${routingKey}-${eventId}`,
          );

          Logger.log(keyExists)

          if (!keyExists) {
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

      if (eventId && !keyExists) {
        void this.logService.writeIdempotencyKey(
          `${queueName}-${routingKey}-${eventId}`,
        );
      }
    };
  };
}
