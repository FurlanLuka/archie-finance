import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, ParagraphM, ParagraphS, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

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
      <ParagraphM weight={800} className="title">
        {t('payment_modal.payment_scheduled.title')}
      </ParagraphM>
      <ParagraphS weight={600}>{t('payment_modal.payment_scheduled.credit_for', { name })}</ParagraphS>
      <ParagraphXS>{t('payment_modal.payment_scheduled.last_payment', { lastPayment, date })}</ParagraphXS>
      <div className="divider" />
      <ParagraphM weight={500} className="scheduled-note">
        {t('payment_modal.payment_scheduled.scheduled_note', { newPayment })}
      </ParagraphM>
      <ParagraphS weight={600}>{t('payment_modal.payment_scheduled.email_note')}</ParagraphS>
      <ParagraphS>{t('payment_modal.payment_scheduled.time_note')}</ParagraphS>
      <div className="btn-group">
        <ButtonPrimary maxWidth="250px" onClick={handleConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </div>
    </PaymentScheduledModalStyled>
  );
};
