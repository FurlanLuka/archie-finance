import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ScheduleTransactionParams } from '@archie-webapps/shared/data-access/archie-api/payment/api/schedule-transaction';
import { useScheduleTransaction } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-schedule-transaction';
import { ButtonOutline, ButtonPrimary, TitleM, BodyL, BodyM, FormError } from '@archie-webapps/shared/ui/design-system';

import { PaymentConfirmModalStyled } from './payment-confirm.styled';

interface PaymentConfirmModalProps {
  onConfirm: () => void;
  onBack: () => void;
  scheduledTransactionParams: ScheduleTransactionParams;
}

export const PaymentConfirmModal: FC<PaymentConfirmModalProps> = ({
  onConfirm,
  scheduledTransactionParams,
  onBack,
}) => {
  const { t } = useTranslation();
  const scheduleTransactionMutation = useScheduleTransaction();

  useEffect(() => {
    if (scheduleTransactionMutation.state === RequestState.SUCCESS) {
      onConfirm();
    }
  }, [scheduleTransactionMutation.state, onConfirm]);

  const handleConfirm = () => {
    if (
      scheduleTransactionMutation.state === RequestState.IDLE ||
      scheduleTransactionMutation.state === RequestState.ERROR
    ) {
      scheduleTransactionMutation.mutate(scheduledTransactionParams);
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <PaymentConfirmModalStyled>
      <BodyM weight={800} className="balance-note">
        {t('payment_modal.payment_confirm.balance_note')}
      </BodyM>
      <TitleM weight={400} className="balance-value">
        ${scheduledTransactionParams.amount}
      </TitleM>
      <BodyL>{t('payment_modal.payment_confirm.time_note')}</BodyL>
      {scheduleTransactionMutation.state === RequestState.ERROR && (
        <FormError>{t('payment_modal.payment_confirm.error')}</FormError>
      )}
      <div className="btn-group">
        <ButtonPrimary maxWidth="100%" onClick={handleConfirm}>
          {t('btn_next')}
        </ButtonPrimary>
        <ButtonOutline
          maxWidth="100%"
          onClick={handleBack}
          isDisabled={scheduleTransactionMutation.state === RequestState.LOADING}
        >
          {t('btn_back')}
        </ButtonOutline>
      </div>
    </PaymentConfirmModalStyled>
  );
};
