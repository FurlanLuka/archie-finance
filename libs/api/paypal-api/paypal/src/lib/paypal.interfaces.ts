export interface WebhookHeaders {
  'paypal-auth-algo': string;
  'paypal-auth-version': string;
  'paypal-cert-url': string;
  'paypal-transmission-id': string;
  'paypal-transmission-sig': string;
  'paypal-transmission-time': string;
}

export enum PaypalEventType {
  'CHECKOUT.ORDER.APPROVED' = 'CHECKOUT.ORDER.APPROVED',
}

export enum OrderStatus {
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
}

export interface PaypalWebhookBody {
  event_type: PaypalEventType;
  resource: {
    id: string;
  };
}
