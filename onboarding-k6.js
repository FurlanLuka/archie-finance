import Amqp from 'k6/x/amqp';
import Queue from 'k6/x/amqp/queue';

export default function () {
  console.log('K6 amqp extension enabled, version: ' + Amqp.version);
  const url = 'amqp://guest:guest@localhost:5672/';
  Amqp.start({
    connection_url: url,
  });
  console.log('Connection opened: ' + url);

  const queueName =
    'onboarding-api-queue-onboarding-archie.microservice.tx_user.email.verified.v1';

  // Queue.declare({
  //   name: queueName,
  //   // durable: false,
  //   // delete_when_unused: false,
  //   // exclusive: false,
  //   // no_wait: false,
  //   // args: null
  // })
  //
  // console.log(queueName + " queue is ready")
  Amqp.publish({
    queue_name: queueName,
    body: JSON.stringify({
      k6: 'try1',
    }),
    content_type: 'application/json',
    properties: {
      headers: {},
    },
    // exchange: '',
    // mandatory: false,
    // immediate: false,
  });

  // const listener = function(data) { console.log('received data: ' + data) }
  // Amqp.listen({
  //   queue_name: queueName,
  //   listener: listener,
  //   // consumer: '',
  //   // auto_ack: true,
  //   // exclusive: false,
  //   // no_local: false,
  //   // no_wait: false,
  //   // args: null
  // })
}
