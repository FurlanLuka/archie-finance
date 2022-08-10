import { PaymentFlowAction, PaymentFlowActionType, PaymentFlowState } from './payment-flow.interfaces';

export const initialState: PaymentFlowState = {
  stage: 'INITIALIZING',
};

export const paymentFlowReducer = (_state: PaymentFlowState, action: PaymentFlowAction): PaymentFlowState => {
  switch (action.type) {
    case PaymentFlowActionType.GO_TO_PAYMENT_SCHEDULE:
      return {
        stage: 'PAYMENT_SCHEDULE',
      };
    case PaymentFlowActionType.GO_TO_PLAID_LINK:
      return {
        stage: 'PLAID_LINK',
      };
    case PaymentFlowActionType.GO_TO_CONNECT_ACCOUNT:
      return {
        stage: 'CONNECT_ACCOUNT',
        itemId: action.payload.itemId,
      };
    default:
      throw new Error('Unsupported action');
  }
};
