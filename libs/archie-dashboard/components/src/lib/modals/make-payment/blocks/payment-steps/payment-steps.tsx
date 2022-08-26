import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStep } from '@archie-webapps/archie-dashboard/constants';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';

import { Balances } from '../../make-payment.interfaces';
import { ChooseAccount } from '../choose-account/choose-account';
import { PaymentConfirmModal } from '../payment-confirm/payment-confirm';
import { PaymentScheduleForm } from '../payment-schedule-form/payment-schedule-form';
import { PaymentScheduledModal } from '../payment-scheduled/payment-scheduled';

interface PaymentStepsProps {
  balances: Balances;
  close: () => void;
}

export const PaymentSteps: FC<PaymentStepsProps> = ({ balances, close }) => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.ACCOUNT);
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);

  const handleConfirm = () => {
    setCurrentStep(PaymentStep.SCHEDULE);
    close();
  };

  const getContent = (step: PaymentStep) => {
    switch (step) {
      case PaymentStep.ACCOUNT:
        return (
          <ChooseAccount
            onConfirm={(account) => {
              setSelectedAccount(account);
              setCurrentStep(PaymentStep.SCHEDULE);
            }}
          />
        );
      case PaymentStep.SCHEDULE:
        return (
          <PaymentScheduleForm
            balances={balances}
            onConfirm={(desiredAmount: number, desiredDate: string) => {
              setAmount(desiredAmount);
              setScheduledDate(desiredDate);
              setCurrentStep(PaymentStep.CONFIRM);
            }}
          />
        );
      case PaymentStep.CONFIRM:
        return (
          <PaymentConfirmModal
            onConfirm={() => setCurrentStep(PaymentStep.SCHEDULED)}
            onBack={() => setCurrentStep(PaymentStep.SCHEDULE)}
          />
        );
      case PaymentStep.SCHEDULED:
        return <PaymentScheduledModal onConfirm={handleConfirm} />;
      default:
        console.warn('Unhandled step state');
        return null;
    }
  };

  return getContent(currentStep);
};
