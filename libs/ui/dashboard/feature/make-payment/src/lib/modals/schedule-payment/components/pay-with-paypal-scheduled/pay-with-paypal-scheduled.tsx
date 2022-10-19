import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonPrimary,
  TitleS,
  BodyL,
  BodyM,
} from '@archie/ui/shared/ui/design-system';

import { PayWithPaypalScheduledStyled } from './pay-with-paypal-scheduled.styled';

interface PayWithPaypalScheduledProps {
  onConfirm: () => void;
}

export const PayWithPaypalScheduled: FC<PayWithPaypalScheduledProps> = ({
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <PayWithPaypalScheduledStyled>
      <TitleS className="title">
        {t('payment_modal.payment_scheduled.title')}
      </TitleS>
      <BodyL weight={700} className="scheduled-note">
        {t('payment_modal.pay_with_paypal_form.processed_note')}
      </BodyL>
      <BodyM weight={600}>
        {t('payment_modal.pay_with_paypal_form.email_note')}
      </BodyM>
      <BodyM>{t('payment_modal.pay_with_paypal_form.time_note')}</BodyM>
      <div className="btn-group">
        <ButtonPrimary width="250px" onClick={onConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </div>
    </PayWithPaypalScheduledStyled>
  );
};
