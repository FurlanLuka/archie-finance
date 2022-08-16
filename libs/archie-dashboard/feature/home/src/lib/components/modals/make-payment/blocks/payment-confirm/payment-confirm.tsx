import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonOutline,
  ButtonPrimary,
  ParagraphM,
  SubtitleS,
  ParagraphS,
  ParagraphXS,
} from '@archie-webapps/shared/ui/design-system';

import { PaymentConfirmModalStyled } from './payment-confirm.styled';

interface PaymentConfirmModalProps {
  onConfirm: () => void;
  onBack: () => void;
}

export const PaymentConfirmModal: FC<PaymentConfirmModalProps> = ({ onConfirm, onBack }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  const handleBack = () => {
    onBack();
  };

  // Temp data
  const name = 'Jovana';
  const lastPayment = '6,640.54';
  const date = 'May 23, 2022';
  const newPayment = '1,200';

  return (
    <PaymentConfirmModalStyled>
      <ParagraphM weight={800} className="title">
        {t('dashboard_home.payment_confirm_modal.title')}
      </ParagraphM>
      <ParagraphS weight={600}>{t('dashboard_home.payment_confirm_modal.credit_for', { name })}</ParagraphS>
      <ParagraphXS>{t('dashboard_home.payment_confirm_modal.last_payment', { lastPayment, date })}</ParagraphXS>
      <div className="divider" />
      <ParagraphXS weight={800} className="balance-note">
        {t('dashboard_home.payment_confirm_modal.balance_note')}
      </ParagraphXS>
      <SubtitleS weight={400} className="balance-value">
        ${newPayment}
      </SubtitleS>
      <ParagraphS>{t('dashboard_home.payment_confirm_modal.time_note')}</ParagraphS>
      <div className="btn-group">
        <ButtonPrimary onClick={handleConfirm}>{t('btn_next')}</ButtonPrimary>
        <ButtonOutline onClick={handleBack}>{t('btn_back')}</ButtonOutline>
      </div>
    </PaymentConfirmModalStyled>
  );
};
