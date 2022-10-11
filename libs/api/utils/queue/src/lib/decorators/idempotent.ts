import { Logger } from "@nestjs/common";

export function Idempotent(routingKey: string, queueName: string): MethodDecorator {
  // const injector = Inject(DynamodbService)

  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    // injector(target, 'dynamodbService');

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      throw new Error('errr');
      await originalMethod.apply(this, args[0]);
    };
  };
}
