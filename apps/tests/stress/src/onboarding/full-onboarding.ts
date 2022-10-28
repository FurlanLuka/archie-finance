// @ts-ignore
import Amqp from 'k6/x/amqp';
import { Options } from 'k6/options';
import {
  SERVICE_NAME,
  ONBOARDING_UPDATED_TOPIC,
} from '@archie/api/onboarding-api/constants';
// @ts-ignore
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options: Options = {
  // TODO: read options from env variables - stringified options object / partial
  vus: 10,
  duration: '20s',
};

export function setup() {
  console.log('Setup started');
  const url: string = __ENV.QUEUE_URL;
  Amqp.start({
    connection_url: url,
  });
  console.log('Setup completed');
}

export default function () {
  console.log('Test started');
  const queueName = `${SERVICE_NAME}-archie.microservice.tx_${ONBOARDING_UPDATED_TOPIC.getRoutingKey()}`;

  Amqp.publish({
    queue_name: queueName,
    body: JSON.stringify({
      k6: 'test1',
    }),
    content_type: 'application/json',
    headers: {
      'event-id': uuidv4(),
    },
  });

  console.log('Test ended');
}
