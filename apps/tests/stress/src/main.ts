// // @ts-ignore
// import { sleep, check } from 'k6';
//
// import http from 'k6/http';
// // @ts-ignore
// import Amqp from 'k6/x/amqp';
// // import { Options } from 'k6/options';
//
// // export let options: Options = {
// //   vus: 1,
// //   duration: '1s',
// // };
//
// export default () => {
//   console.log('start');
//   // const url: string = 'amqp://guest:guest@localhost:5672/';
//   // Amqp.start({
//   //   connection_url: url,
//   // });
//   console.log('here', JSON.stringify('http', http.get));
//   const res = http.get('https://test-api.k6.io');
//   check(res, {
//     'status is 200': () => res.status === 200,
//   });
//   sleep(1);
// };

// import http from 'k6/http';
// import { check } from 'k6';
// import cheerio from 'cheerio';
//
// export default function () {
//   const res = http.get('https://loadimpact.com/');
//   const $ = cheerio.load(res.body);
//
//   const title = $('head title').text();
//   check(title, {
//     'has correct title': () => title == 'Load Impact is now k6',
//   });
//   console.log(title);
// }

// @ts-ignore
import Amqp from 'k6/x/amqp';
// import * as amqp from 'amqplib/callback_api';
// const amqp = require('amqplib/callback_api')
// import * as amqp from 'amqplib';
// import "regenerator-runtime/runtime";
import http from 'k6/http';

export default function () {
  // console.log('K6 amqp extension enabled, version: ' + Amqp.version);
  const res = http.get('https://test-api.k6.io');
  console.log(res);

  const url: string = 'amqp://guest:guest@localhost:5672/';
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
    headers: {
      header1: 'he',
    },
    // exchange: '',
    // mandatory: false,
    // immediate: false,
  });

  const listener = function (data: object) {
    console.log('received data: ' + data);
  };
  Amqp.listen({
    queue_name: queueName,
    listener: listener,
    // consumer: '',
    auto_ack: true,
    exclusive: true,
    // no_local: false,
    no_wait: false,
    // args: null
  });
  console.log('end');
  //   console.log('before connect')
  // console.log(JSON.stringify(amqp, null, 2))
  //   amqp.connect(url, (error, conn)=> {
  //     console.log('end1')
  //   })
  //   console.log('actualEnd')
  // const connection = await amqp.connect(url)
  // const channel = await connection.createChannel()
}
