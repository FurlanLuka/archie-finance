import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { PaymentStep } from '@archie/ui/dashboard/constants';

export enum PaymentStepsActionType {
  MOVE_TO_SCHEDULE_STEP = 'MOVE_TO_SCHEDULE_STEP',
  MOVE_TO_CONFIRM_STEP = 'MOVE_TO_CONFIRM_STEP',
  MOVE_TO_COMPLETED_STEP = 'MOVE_TO_COMPLETED_STEP',
}

export type PaymentStepsAction =
  | {
      type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP;
      // payload: {
      //   selectedAccount: PaymentInstrument ;
      // };
    }
  | {
      type: PaymentStepsActionType.MOVE_TO_CONFIRM_STEP;
      amount: number;
      // payload: {
      //   amount: number;
      //   scheduledDate: string;
      //   selectedAccount: PaymentInstrument ;
      // };
    }
  | {
      type: PaymentStepsActionType.MOVE_TO_COMPLETED_STEP;
      amount: number;
      // payload: {
      //   amount: number;
      //   scheduledDate: string;
      //   selectedAccount: PaymentInstrument ;
      // };
    };

export type PaymentStepsState =
  // | {
  //     step: PaymentStep.ACCOUNT;
  //     selectedAccount: null;
  //     amount: null;
  //     scheduledDate: null;
  //   }
  | {
      step: PaymentStep.SCHEDULE;
      // selectedAccount: PaymentInstrument ;
      amount: null;
      // scheduledDate: null;
    }
  | {
      step: PaymentStep.CONFIRM;
      // selectedAccount: PaymentInstrument ;
      amount: number;
      // scheduledDate: string;
    }
  | {
      step: PaymentStep.SCHEDULED;
      // selectedAccount: PaymentInstrument ;
      amount: number;
      // scheduledDate: string;
    };

export const initalPaymentStepsState: PaymentStepsState = {
  // step: PaymentStep.ACCOUNT,
  step: PaymentStep.SCHEDULE,
  // selectedAccount: null,
  amount: null,
  // scheduledDate: null,
};

export const paymentStepsReducer = (
  state: PaymentStepsState,
  action: PaymentStepsAction,
): PaymentStepsState => {
  switch (action.type) {
    case PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP:
      return {
        step: PaymentStep.SCHEDULE,
        // selectedAccount: action.payload.selectedAccount,
        amount: null,
        // scheduledDate: null,
      };
    case PaymentStepsActionType.MOVE_TO_CONFIRM_STEP:
      return {
        step: PaymentStep.CONFIRM,
        // selectedAccount: action.payload.selectedAccount,
        // amount: action.payload.amount,
        amount: action.amount,
        // scheduledDate: action.payload.scheduledDate,
      };
    case PaymentStepsActionType.MOVE_TO_COMPLETED_STEP:
      return {
        step: PaymentStep.SCHEDULED,
        // selectedAccount: action.payload.selectedAccount,
        // amount: action.payload.amount,
        amount: action.amount,
        // scheduledDate: action.payload.scheduledDate,
      };
    default:
      throw new Error('Unsupported action type');
  }
};
