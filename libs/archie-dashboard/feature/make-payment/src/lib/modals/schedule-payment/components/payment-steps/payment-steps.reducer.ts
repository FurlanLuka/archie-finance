import { PaymentStep } from '@archie-webapps/archie-dashboard/constants';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';

export enum PaymentStepsActionType {
  MOVE_TO_SCHEDULE_STEP = 'MOVE_TO_SCHEDULE_STEP',
  MOVE_TO_CONFIRM_STEP = 'MOVE_TO_CONFIRM_STEP',
  MOVE_TO_COMPLETED_STEP = 'MOVE_TO_COMPLETED_STEP',
}

export type PaymentStepsAction =
  | {
      type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP;
      payload: {
        selectedAccount: AccountResponse;
      };
    }
  | {
      type: PaymentStepsActionType.MOVE_TO_CONFIRM_STEP;
      payload: {
        amount: number;
        // scheduledDate: string;
        selectedAccount: AccountResponse;
      };
    }
  | {
      type: PaymentStepsActionType.MOVE_TO_COMPLETED_STEP;
      payload: {
        amount: number;
        scheduledDate: string;
        selectedAccount: AccountResponse;
      };
    };

export type PaymentStepsState =
  | {
      step: PaymentStep.ACCOUNT;
      selectedAccount: null;
      amount: null;
      scheduledDate: null;
    }
  | {
      step: PaymentStep.SCHEDULE;
      selectedAccount: AccountResponse;
      amount: null;
      scheduledDate: null;
    }
  | {
      step: PaymentStep.CONFIRM;
      selectedAccount: AccountResponse;
      amount: number;
      // scheduledDate: string;
    }
  | {
      step: PaymentStep.SCHEDULED;
      selectedAccount: AccountResponse;
      amount: number;
      scheduledDate: string;
    };

export const initalPaymentStepsState: PaymentStepsState = {
  step: PaymentStep.ACCOUNT,
  selectedAccount: null,
  amount: null,
  scheduledDate: null,
};

export const paymentStepsReducer = (state: PaymentStepsState, action: PaymentStepsAction): PaymentStepsState => {
  switch (action.type) {
    case PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP:
      return {
        step: PaymentStep.SCHEDULE,
        selectedAccount: action.payload.selectedAccount,
        amount: null,
        scheduledDate: null,
      };
    case PaymentStepsActionType.MOVE_TO_CONFIRM_STEP:
      return {
        step: PaymentStep.CONFIRM,
        selectedAccount: action.payload.selectedAccount,
        amount: action.payload.amount,
        // scheduledDate: action.payload.scheduledDate,
      };
    case PaymentStepsActionType.MOVE_TO_COMPLETED_STEP:
      return {
        step: PaymentStep.SCHEDULED,
        selectedAccount: action.payload.selectedAccount,
        amount: action.payload.amount,
        scheduledDate: action.payload.scheduledDate,
      };
    default:
      throw new Error('Unsupported action type');
  }
};
