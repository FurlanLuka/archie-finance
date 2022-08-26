import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { PaymentScheduledModalStyled } from './payment-scheduled.styled';

interface PaymentScheduledModalProps {
  onConfirm: () => void;
  text: string;
}

export const PaymentScheduledModal: FC<PaymentScheduledModalProps> = ({ onConfirm, text }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <PaymentScheduledModalStyled>
      <ParagraphM weight={500} className="scheduled-note">
        {text}
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
