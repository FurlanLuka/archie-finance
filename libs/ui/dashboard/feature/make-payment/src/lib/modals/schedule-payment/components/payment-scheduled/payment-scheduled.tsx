import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';
import { UserObligations } from '@archie/ui/shared/data-access/archie-api/payment/api/get-obligations';
import {
  ButtonPrimary,
  TitleS,
  BodyL,
  BodyM,
} from '@archie/ui/shared/design-system';

import { PaymentScheduledStyled } from './payment-scheduled.styled';

interface PaymentScheduledProps {
  onConfirm: () => void;
  obligations: UserObligations;
  kycData: KycResponse;
  text: string;
}

export const PaymentScheduled: FC<PaymentScheduledProps> = ({
  onConfirm,
  obligations,
  kycData,
  text,
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <PaymentScheduledStyled>
      <TitleS className="title">
        {t('payment_modal.payment_scheduled.title')}
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
      <BodyL weight={700} className="scheduled-note">
        {text}
      </BodyL>
      <BodyM weight={600}>
        {t('payment_modal.payment_scheduled.email_note')}
      </BodyM>
      <BodyM>{t('payment_modal.payment_scheduled.time_note')}</BodyM>
      <div className="btn-group">
        <ButtonPrimary width="250px" onClick={handleConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </div>
    </PaymentScheduledStyled>
  );
};
