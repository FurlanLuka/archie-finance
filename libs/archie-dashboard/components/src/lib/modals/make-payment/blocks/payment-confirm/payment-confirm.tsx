import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, ButtonPrimary, TitleM, TitleS, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';

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
      <TitleS className="title">{t('dashboard_home.payment_confirm_modal.title')}</TitleS>
      <BodyL weight={600}>{t('dashboard_home.payment_confirm_modal.credit_for', { name })}</BodyL>
      <BodyM>{t('dashboard_home.payment_confirm_modal.last_payment', { lastPayment, date })}</BodyM>
      <div className="divider" />
      <BodyM weight={800} className="balance-note">
        {t('dashboard_home.payment_confirm_modal.balance_note')}
      </BodyM>
      <TitleM weight={400} className="balance-value">
        ${newPayment}
      </TitleM>
      <BodyL>{t('dashboard_home.payment_confirm_modal.time_note')}</BodyL>
      <div className="btn-group">
        <ButtonPrimary maxWidth="100%" onClick={handleConfirm}>
          {t('btn_next')}
        </ButtonPrimary>
        <ButtonOutline maxWidth="100%" onClick={handleBack}>
          {t('btn_back')}
        </ButtonOutline>
      </div>
    </PaymentConfirmModalStyled>
  );
};
