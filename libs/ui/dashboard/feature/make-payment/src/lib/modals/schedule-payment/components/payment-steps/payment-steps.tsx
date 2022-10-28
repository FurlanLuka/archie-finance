import { FC, useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';
import { PaymentStep } from '@archie/ui/dashboard/constants';
import { UserObligations } from '@archie/ui/shared/data-access/archie-api/payment/api/get-obligations';

import { ChooseAccount } from '../choose-account/choose-account';
import { PayWithPaypalConfirm } from '../pay-with-paypal-confirm/pay-with-paypal-confirm';
import { PayWithPaypalForm } from '../pay-with-paypal-form/pay-with-paypal-form';
import { PayWithPaypalScheduled } from '../pay-with-paypal-scheduled/pay-with-paypal-scheduled';
import { PaymentConfirm } from '../payment-confirm/payment-confirm';
import { PaymentScheduleForm } from '../payment-schedule-form/payment-schedule-form';
import { PaymentScheduled } from '../payment-scheduled/payment-scheduled';

import {
  initalPaymentStepsState,
  PaymentStepsActionType,
  paymentStepsReducer,
} from './payment-steps.reducer';

interface PaymentStepsProps {
  obligations: UserObligations;
  kycData: KycResponse;
  close: () => void;
}

export const PaymentSteps: FC<PaymentStepsProps> = ({
  obligations,
  kycData,
  close,
}) => {
  const { t } = useTranslation();

  const [stepsState, dispatch] = useReducer(
    paymentStepsReducer,
    initalPaymentStepsState,
  );

  const getContent = () => {
    switch (stepsState.step) {
      // case PaymentStep.ACCOUNT:
      //   return (
      //     <ChooseAccount
      //       onConfirm={(account) => {
      //         dispatch({
      //           type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP,
      //           payload: {
      //             selectedAccount: account,
      //           },
      //         });
      //       }}
      //     />
      //   );
      case PaymentStep.SCHEDULE:
        return (
          <PayWithPaypalForm
            obligations={obligations}
            kycData={kycData}
            onConfirm={(desiredAmount: number) => {
              dispatch({
                type: PaymentStepsActionType.MOVE_TO_CONFIRM_STEP,
                amount: desiredAmount,
              });
            }}
          />
          // <PaymentScheduleForm
          //   obligations={obligations}
          //   kycData={kycData}
          //   onConfirm={(desiredAmount: number, desiredDate: string) => {
          //     dispatch({
          //       type: PaymentStepsActionType.MOVE_TO_CONFIRM_STEP,
          //       payload: {
          //         selectedAccount: stepsState.selectedAccount,
          //         amount: desiredAmount,
          //         scheduledDate: desiredDate,
          //       },
          //     });
          //   }}
          // />
        );
      case PaymentStep.CONFIRM:
        return (
          <PayWithPaypalConfirm
            obligations={obligations}
            kycData={kycData}
            onConfirm={() => close()}
            onBack={() => {
              dispatch({
                type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP,
              });
            }}
            paymentAmount={stepsState.amount}
          />
          // <PaymentConfirm
          //   obligations={obligations}
          //   kycData={kycData}
          //   onConfirm={() => close()}
          //   onBack={() => {
          //     dispatch({
          //       type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP,
          //       payload: {
          //         selectedAccount: stepsState.selectedAccount,
          //       },
          //     });
          //   }}
          //   scheduledTransactionParams={{
          //     amount: stepsState.amount,
          //     paymentInstrumentId: stepsState.selectedAccount.id,
          //     scheduledDate: stepsState.scheduledDate,
          //   }}
          // />
        );
      // case PaymentStep.SCHEDULED:
      //   return (
      //     <PaymentScheduled
      //       obligations={obligations}
      //       kycData={kycData}
      //       onConfirm={() => close()}
      //       text={t('payment_modal.payment_scheduled.scheduled_note', {
      //         newPayment: stepsState.amount,
      //         scheduledDate: stepsState.scheduledDate,
      //       })}
      //     />
      //   );
      default:
        console.warn('Unhandled step state');
        return null;
    }
  };

  return getContent();
};
