import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, TitleS, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';

import { PaymentScheduledModalStyled } from './payment-scheduled.styled';

interface PaymentScheduledModalProps {
  onConfirm: () => void;
}

export const PaymentScheduledModal: FC<PaymentScheduledModalProps> = ({ onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  // Temp data
  const name = 'Jovana';
  const lastPayment = '6,640.54';
  const date = 'May 23, 2022';
  const newPayment = '1,200';

  return (
    <PaymentScheduledModalStyled>
      <TitleS className="title">{t('dashboard_home.payment_scheduled_modal.title')}</TitleS>
      <BodyL weight={600}>{t('dashboard_home.payment_scheduled_modal.credit_for', { name })}</BodyL>
      <BodyM>{t('dashboard_home.payment_scheduled_modal.last_payment', { lastPayment, date })}</BodyM>
      <div className="divider" />
      <TitleS weight={500} className="scheduled-note">
        {t('dashboard_home.payment_scheduled_modal.scheduled_note', { newPayment })}
      </TitleS>
      <BodyL weight={600}>{t('dashboard_home.payment_scheduled_modal.email_note')}</BodyL>
      <BodyL>{t('dashboard_home.payment_scheduled_modal.time_note')}</BodyL>
      <div className="btn-group">
        <ButtonPrimary maxWidth="250px" onClick={handleConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </div>
    </PaymentScheduledModalStyled>
  );
};
