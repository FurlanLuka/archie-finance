import { format } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonPrimary,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
} from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { PaymentScheduleModalStyled, InputRadio } from './payment-schedule.styled';

interface PaymentScheduleModalProps {
  onConfirm: () => void;
}

export const PaymentScheduleModal: FC<PaymentScheduleModalProps> = ({ onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  // Temp data
  const name = 'Jovana';
  const lastPayment = '6,640.54';
  const date = 'May 23, 2022';
  const iterestOwed = 200;
  const balanceOwed = '1,000';
  const balanceWithInterest = '1,200';
  const fullBalance = '1,237.63';

  return (
    <PaymentScheduleModalStyled>
      <ParagraphM weight={800} className="title">
        {t('dashboard_home.payment_schedule_modal.title')}
      </ParagraphM>
      <ParagraphS weight={600}>{t('dashboard_home.payment_schedule_modal.credit_for', { name })}</ParagraphS>
      <ParagraphXS>{t('dashboard_home.payment_schedule_modal.last_payment', { lastPayment, date })}</ParagraphXS>
      <ParagraphXS>{t('dashboard_home.payment_schedule_modal.interest_owed', { iterestOwed })}</ParagraphXS>
      <div className="divider" />
      <ParagraphXS weight={800}>{t('dashboard_home.payment_schedule_modal.payment_date')}</ParagraphXS>
      <ParagraphXS className="payment-date">
        {format(new Date(), 'MMMM dd, yyyy')} |{' '}
        <button className="btn-schedule">{t('dashboard_home.payment_schedule_modal.schedule')}</button>
      </ParagraphXS>
      <ParagraphXXS color={theme.textSecondary} weight={700}>
        <label className="radio-auto-payments">
          <input type="radio" value="auto_payments" />
          {t('dashboard_home.payment_schedule_modal.auto_payments')} {t('off')} {/* I guess temp */}
        </label>
      </ParagraphXXS>
      <div className="divider" />
      <ParagraphXS weight={800}>{t('dashboard_home.payment_schedule_modal.payment_options')}</ParagraphXS>
      <div className="radio-group">
        <ParagraphS weight={500}>
          <InputRadio>
            <input type="radio" name="payment_option" value="balance_owed" />
            {t('dashboard_home.payment_schedule_modal.balance_owed', { balanceOwed })}
          </InputRadio>
        </ParagraphS>
        <ParagraphS weight={500}>
          <InputRadio>
            <input type="radio" name="payment_option" value="balance_with_interest" />
            {t('dashboard_home.payment_schedule_modal.balance_with_interest', { balanceWithInterest })}
          </InputRadio>
        </ParagraphS>
        <ParagraphS weight={500}>
          <InputRadio>
            <input type="radio" name="payment_option" value="full_balance" />
            {t('dashboard_home.payment_schedule_modal.full_balance', { fullBalance })}
          </InputRadio>
        </ParagraphS>
        <ParagraphS weight={500}>
          <InputRadio>
            <input type="radio" name="payment_option" value="other_amount" />
            {t('dashboard_home.payment_schedule_modal.other_amount')}
          </InputRadio>
        </ParagraphS>
      </div>
      <div className="btn-group">
        <ButtonPrimary maxWidth="250px" onClick={handleConfirm}>
          {t('btn_next')}
        </ButtonPrimary>
      </div>
    </PaymentScheduleModalStyled>
  );
};
