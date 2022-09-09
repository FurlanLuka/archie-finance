import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Kyc } from '@archie-webapps/shared/data-access/archie-api/kyc/api/get-kyc';
import { UserObligations } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-obligations';
import { ButtonPrimary, TitleS, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';

import { PayWithPaypalScheduledStyled } from './pay-with-paypal-scheduled.styled';

interface PayWithPaypalScheduledProps {
  onConfirm: () => void;
  obligations: UserObligations;
  kycData: Kyc;
  text: string;
}

export const PayWithPaypalScheduled: FC<PayWithPaypalScheduledProps> = ({ onConfirm, obligations, kycData, text }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <PayWithPaypalScheduledStyled>
      <TitleS className="title">{t('payment_modal.payment_scheduled.title')}</TitleS>
      <BodyL weight={600}>{t('payment_modal.credit_for', { name: kycData.firstName })}</BodyL>
      <BodyM>
        {t('payment_modal.interest_owed', {
          interestOwed: obligations.interestOwed,
        })}
      </BodyM>
      <div className="divider" />
      <BodyL weight={700} className="scheduled-note">
        {text}
      </BodyL>
      <BodyM weight={600}>{t('payment_modal.pay_with_paypal_form.email_note')}</BodyM>
      <BodyM>{t('payment_modal.pay_with_paypal_form.time_note')}</BodyM>
      <div className="btn-group">
        <ButtonPrimary maxWidth="250px" onClick={handleConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </div>
    </PayWithPaypalScheduledStyled>
  );
};
