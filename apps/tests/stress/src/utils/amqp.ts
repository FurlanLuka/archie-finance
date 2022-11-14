// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Amqp from 'k6/x/amqp';
import { Event } from '@archie/api/utils/queue/events';
import { uuidv4 } from './k6-libs';
import { QUEUE_URL } from '../config';

export function setupAmqpConnection(): Amqp {
  if (QUEUE_URL === undefined)
    throw new Error('QUEUE_URL_ENV_VARIABLE_MISSING');

  return Amqp.start({
    connection_url: QUEUE_URL,
  });
}

export function publishQueueMessage<T extends object>(
  event: Event<T>,
  serviceQueueName: string,
  message: T,
  exchange = 'archie.microservice.tx',
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
