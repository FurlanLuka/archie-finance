import { Logger } from '@nestjs/common';
import tracer, { Span } from 'dd-trace';
import { QueueMessageMeta } from './queue_decorators.interfaces';

export function TraceEvent(
  queueName: string,
  logBody: boolean,
): MethodDecorator {
  return (
    target: object,
    _key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (
      ...args: [object, QueueMessageMeta | undefined, ...unknown[]]
    ): Promise<unknown> {
      const requestPayload = args[0];
      const requestMeta: QueueMessageMeta | undefined = args[1];
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
            const response: unknown = await originalMethod.apply(this, args);
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
