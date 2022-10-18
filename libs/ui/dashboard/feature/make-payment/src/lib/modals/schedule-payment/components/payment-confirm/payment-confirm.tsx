import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-microservices/ui/shared/data-access/archie-api/interface';
import { Kyc } from '@archie-microservices/ui/shared/data-access/archie-api/kyc/api/get-kyc';
import { ScheduleTransactionParams } from '@archie-microservices/ui/shared/data-access/archie-api/payment/api/schedule-transaction';
import { useScheduleTransaction } from '@archie-microservices/ui/shared/data-access/archie-api/payment/hooks/use-schedule-transaction';
import { UserObligations } from '@archie-microservices/ui/shared/data-access/archie-api/payment/api/get-obligations';
import {
  ButtonOutline,
  ButtonPrimary,
  TitleM,
  TitleS,
  BodyL,
  BodyM,
  FormError,
} from '@archie-microservices/ui/shared/ui/design-system';

import { PaymentConfirmStyled } from './payment-confirm.styled';

interface PaymentConfirmProps {
  onConfirm: () => void;
  onBack: () => void;
  obligations: UserObligations;
  kycData: Kyc;
  scheduledTransactionParams: ScheduleTransactionParams;
}

export const PaymentConfirm: FC<PaymentConfirmProps> = ({
  onConfirm,
  onBack,
  obligations,
  kycData,
  scheduledTransactionParams,
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
    <PaymentConfirmStyled>
      <TitleS className="title">
        {t('payment_modal.payment_confirm.title')}
      </TitleS>
      <BodyL weight={600}>
        {t('payment_modal.credit_for', { name: kycData.firstName })}
      </BodyL>
      <BodyM>
        {t('payment_modal.interest_owed', {
          interestOwed: obligations.interestOwed,
        })}
      </BodyM>
      <div className="divider" />
      <BodyM weight={800} className="balance-note">
        {t('payment_modal.payment_confirm.balance_note')}
      </BodyM>
      <TitleM weight={400} className="balance-value">
        ${scheduledTransactionParams.amount}
      </TitleM>
      <BodyM>{t('payment_modal.payment_confirm.time_note')}</BodyM>
      {scheduleTransactionMutation.state === RequestState.ERROR && (
        <FormError>{t('error.try_again')}</FormError>
      )}
      <div className="btn-group">
        <ButtonPrimary width="100%" onClick={handleConfirm}>
          {t('btn_next')}
        </ButtonPrimary>
        <ButtonOutline
          width="100%"
          onClick={handleBack}
          isDisabled={
            scheduleTransactionMutation.state === RequestState.LOADING
          }
        >
          {t('btn_back')}
        </ButtonOutline>
      </div>
    </PaymentConfirmStyled>
  );
};