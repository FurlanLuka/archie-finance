/*
 * Initializing -> just load, and set state accordingly
 * if connectedAccounts -> PaymentSchedule, 1st step list accounts
 * if no -> connect with plaid
 * connect with plaid -> Plaid link, when created, sync itemId to state -> ConnectAccount
 * connect account -> get for itemId, on select, mutate, invalidate connected accounts query
 */

export enum PaymentFlowActionType {
  GO_TO_PAYMENT_SCHEDULE = 'GO_TO_PAYMENT_SCHEDULE',
  GO_TO_PLAID_LINK = 'GO_TO_PLAID_LINK',
  GO_TO_CONNECT_ACCOUNT = 'GO_TO_CONNECT_ACCOUNT',
}

export type PaymentFlowAction =
  | {
      type: PaymentFlowActionType.GO_TO_PAYMENT_SCHEDULE;
    }
  | {
      type: PaymentFlowActionType.GO_TO_PLAID_LINK;
    }
  | {
      type: PaymentFlowActionType.GO_TO_CONNECT_ACCOUNT;
      payload: { itemId: string };
    };

export type PaymentFlowState =
  | { stage: 'INITIALIZING' }
  | {
      stage: 'PAYMENT_SCHEDULE';
    }
  | {
      stage: 'PLAID_LINK';
    }
  | {
      stage: 'CONNECT_ACCOUNT';
      itemId: string;
    };
