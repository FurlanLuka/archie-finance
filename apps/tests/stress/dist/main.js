/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ main)
});

;// CONCATENATED MODULE: external "k6/x/amqp"
const amqp_namespaceObject = require("k6/x/amqp");
var amqp_default = /*#__PURE__*/__webpack_require__.n(amqp_namespaceObject);
;// CONCATENATED MODULE: external "k6/http"
const http_namespaceObject = require("k6/http");
var http_default = /*#__PURE__*/__webpack_require__.n(http_namespaceObject);
;// CONCATENATED MODULE: ./apps/tests/stress/src/main.ts
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

// import * as amqp from 'amqplib/callback_api';
// const amqp = require('amqplib/callback_api')
// import * as amqp from 'amqplib';
// import "regenerator-runtime/runtime";

/* harmony default export */ function main() {
  // console.log('K6 amqp extension enabled, version: ' + Amqp.version);
  var res = http_default().get('https://test-api.k6.io');
  console.log(res);
  var url = 'amqp://guest:guest@localhost:5672/';
  amqp_default().start({
    connection_url: url
  });
  console.log('Connection opened: ' + url);
  var queueName = 'onboarding-api-queue-onboarding-archie.microservice.tx_user.email.verified.v1';

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
  amqp_default().publish({
    queue_name: queueName,
    body: JSON.stringify({
      k6: 'try1'
    }),
    content_type: 'application/json',
    headers: {
      header1: 'he'
    }
    // exchange: '',
    // mandatory: false,
    // immediate: false,
  });

  var listener = function listener(data) {
    console.log('received data: ' + data);
  };
  amqp_default().listen({
    queue_name: queueName,
    listener: listener,
    // consumer: '',
    auto_ack: true,
    exclusive: true,
    // no_local: false,
    no_wait: false
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
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map