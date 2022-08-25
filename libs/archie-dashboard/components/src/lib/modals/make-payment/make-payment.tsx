import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStep } from '@archie-webapps/archie-dashboard/constants';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { Modal } from '@archie-webapps/shared/ui/design-system';

import { ChooseAccount } from './blocks/choose-account/choose-account';
import { PaymentConfirmModal } from './blocks/payment-confirm/payment-confirm';
import { PaymentScheduleModal } from './blocks/payment-schedule/payment-schedule';
import { PaymentScheduledModal } from './blocks/payment-scheduled/payment-scheduled';

interface MakePaymentModalProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const MakePaymentModal: FC<MakePaymentModalProps> = ({ isOpen, close, onConfirm }) => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.ACCOUNT);
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);

  const handleConfirm = () => {
    onConfirm();
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
          <PaymentScheduleModal
            onConfirm={(desiredAmount) => {
              setAmount(desiredAmount);
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
        return <PaymentScheduleModal onConfirm={() => setCurrentStep(PaymentStep.CONFIRM)} />;
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} maxWidth="780px">
      {getContent(currentStep)}
    </Modal>
  );
};
