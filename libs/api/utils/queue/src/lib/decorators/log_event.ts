import { Logger } from '@nestjs/common';

export function LogEvent(queueName: string, logBody: boolean): MethodDecorator {
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
      Logger.log({
        message: `New event on queue ${queueName} received`,
        payload: logBody ? args[0] : null,
      });

      await originalMethod.apply(this, args);
    };
  };
}
