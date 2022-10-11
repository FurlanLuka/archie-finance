import { Event } from '@archie/api/utils/queue';
import { PaypalPaymentReceivedPayload } from '@archie/api/paypal-api/paypal';

export const SERVICE_NAME = 'paypal-api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  QUEUE_URL = 'QUEUE_URL',
  PAYPAL_CLIENT_ID = 'PAYPAL_CLIENT_ID',
  PAYPAL_CLIENT_SECRET = 'PAYPAL_CLIENT_SECRET',
  PAYPAL_API_URL = 'PAYPAL_API_URL',
  PAYPAL_RETURN_URL = 'PAYPAL_RETURN_URL',
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
}

export const PAYPAL_PAYMENT_RECEIVED_TOPIC =
  new Event<PaypalPaymentReceivedPayload>('paypal.payment.received', 1);

export const PAYPAL_PAYMENT_CURRENCY = 'USD';
