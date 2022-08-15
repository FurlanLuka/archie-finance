import { format } from 'date-fns';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonPrimary,
  InputRadio,
  InputText,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
} from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';

import { PaymentScheduleModalStyled } from './payment-schedule.styled';

interface PaymentScheduleModalProps {
  onConfirm: () => void;
}

export const PaymentScheduleModal: FC<PaymentScheduleModalProps> = ({ onConfirm }) => {
  const { t } = useTranslation();

  const [schedule, setSchedule] = useState(false);

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
      <ParagraphXS weight={800} className="subtitle">
        {t('dashboard_home.payment_schedule_modal.payment_date')}
      </ParagraphXS>
      <ParagraphXS className="payment-date">
        {format(new Date(), 'MMMM dd, yyyy')} |
        {schedule ? (
          <InputText small>
            <input placeholder="mm/dd/yyyy" />
          </InputText>
        ) : (
          <button className="btn-schedule" onClick={() => setSchedule(true)}>
            {t('dashboard_home.payment_schedule_modal.schedule')} <Icon name="calendar" />
          </button>
        )}
      </ParagraphXS>
      <ParagraphXXS weight={700}>
        <InputRadio small>
          <input type="radio" value="auto_payments" checked disabled />
          <ParagraphXXS>
            {t('dashboard_home.payment_schedule_modal.auto_payments')} {t('off')} {/* I guess temp */}
          </ParagraphXXS>
        </InputRadio>
      </ParagraphXXS>
      <div className="divider" />
      <ParagraphXS weight={800} className="subtitle">
        {t('dashboard_home.payment_schedule_modal.payment_options')}
      </ParagraphXS>
      <div className="radio-group">
        <InputRadio>
          <input type="radio" name="payment_option" value="balance_owed" />
          <ParagraphS>{t('dashboard_home.payment_schedule_modal.balance_owed', { balanceOwed })}</ParagraphS>
        </InputRadio>
        <InputRadio>
          <input type="radio" name="payment_option" value="balance_with_interest" />
          <ParagraphS>
            {t('dashboard_home.payment_schedule_modal.balance_with_interest', { balanceWithInterest })}
          </ParagraphS>
        </InputRadio>
        <InputRadio>
          <input type="radio" name="payment_option" value="full_balance" />
          <ParagraphS>{t('dashboard_home.payment_schedule_modal.full_balance', { fullBalance })}</ParagraphS>
        </InputRadio>
        <div className="input-group">
          <InputRadio>
            <input type="radio" name="payment_option" value="other_amount" />
            <ParagraphS>{t('dashboard_home.payment_schedule_modal.other_amount')}</ParagraphS>
          </InputRadio>
          <InputText small>
            <input placeholder="$" />
          </InputText>
        </div>
      </div>
      <div className="btn-group">
        <ButtonPrimary maxWidth="250px" onClick={handleConfirm}>
          {t('btn_next')}
        </ButtonPrimary>
      </div>
    </PaymentScheduleModalStyled>
  );
};
