// @ts-ignore
import Amqp from 'k6/x/amqp';
import { Event } from '@archie/api/utils/queue/events';
import { uuidv4 } from './k6-libs';

export function setupAmqpConnection(): Amqp {
  const url: string | undefined = __ENV.QUEUE_URL;

  if (url === undefined) throw new Error('QUEUE_URL_ENV_VARIABLE_MISSING');

  return Amqp.start({
    connection_url: url,
  });
}

export function publishQueueMessage<T extends object>(
  event: Event<T>,
  serviceQueueName: string,
  message: T,
  exchange: string = 'archie.microservice.tx',
): void {
  const queueName = `${serviceQueueName}-${exchange}_${event.getRoutingKey()}`;

  Amqp.publish({
    queue_name: queueName,
    body: JSON.stringify(message),
    content_type: 'application/json',
    headers: {
      'event-id': uuidv4(),
    },
  });
}
