import { FC, useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStep } from '@archie-webapps/archie-dashboard/constants';

import { Balances } from '../../make-payment.interfaces';
import { ChooseAccount } from '../choose-account/choose-account';
import { PaymentConfirmModal } from '../payment-confirm/payment-confirm';
import { PaymentScheduleForm } from '../payment-schedule-form/payment-schedule-form';
import { PaymentScheduledModal } from '../payment-scheduled/payment-scheduled';

import { initalPaymentStepsState, PaymentStepsActionType, paymentStepsReducer } from './payment-steps.reducer';

interface PaymentStepsProps {
  balances: Balances;
  close: () => void;
}

export const PaymentSteps: FC<PaymentStepsProps> = ({ balances, close }) => {
  const { t } = useTranslation();

  const [stepsState, dispatch] = useReducer(paymentStepsReducer, initalPaymentStepsState);

  const handleConfirm = () => {
    close();
  };

  const getContent = () => {
    switch (stepsState.step) {
      case PaymentStep.ACCOUNT:
        return (
          <ChooseAccount
            onConfirm={(account) => {
              dispatch({
                type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP,
                payload: {
                  selectedAccount: account,
                },
              });
            }}
          />
        );
      case PaymentStep.SCHEDULE:
        return (
          <PaymentScheduleForm
            balances={balances}
            onConfirm={(desiredAmount: number, desiredDate: string) => {
              dispatch({
                type: PaymentStepsActionType.MOVE_TO_CONFIRM_STEP,
                payload: {
                  selectedAccount: stepsState.selectedAccount,
                  amount: desiredAmount,
                  scheduledDate: desiredDate,
                },
              });
            }}
          />
        );
      case PaymentStep.CONFIRM:
        return (
          <PaymentConfirmModal
            onConfirm={() => close()}
            onBack={() => {
              dispatch({
                type: PaymentStepsActionType.MOVE_TO_SCHEDULE_STEP,
                payload: {
                  selectedAccount: stepsState.selectedAccount,
                },
              });
            }}
            scheduledTransactionParams={{
              amount: stepsState.amount,
              paymentInstrumentId: stepsState.selectedAccount.id,
              scheduledDate: stepsState.scheduledDate,
            }}
          />
        );
      case PaymentStep.SCHEDULED:
        return (
          <PaymentScheduledModal
            onConfirm={handleConfirm}
            text={t('payment_modal.payment_scheduled.scheduled_note', {
              newPayment: stepsState.amount,
              scheduledDate: stepsState.scheduledDate,
            })}
          />
        );
      default:
        console.warn('Unhandled step state');
        return null;
    }
  };

  return getContent();
};
