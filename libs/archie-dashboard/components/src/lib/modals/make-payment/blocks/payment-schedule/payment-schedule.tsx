import { yupResolver } from '@hookform/resolvers/yup';
import { format, parse } from 'date-fns';
import { parseDigit, templateFormatter, templateParser } from 'input-format';
import ReactInput from 'input-format/react';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ButtonPrimary,
  FormError,
  InputRadio,
  InputText,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
} from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';

import { PaymentOption } from './payment-schedule.interfaces';
import { PaymentScheduleFormData, getPaymentScheduleFormSchema } from './payment-schedule.schema';
import { PaymentScheduleModalStyled } from './payment-schedule.styled';

interface PaymentScheduleModalProps {
  onConfirm: (amount: number, date: string) => void;
}

// Temp data
const name = 'Jovana';
const lastPayment = '6,640.54';
const date = 'May 23, 2022';
const iterestOwed = 200;
const balanceOwed = 1000;
const balanceWithInterest = 1200;
const fullBalance = 1237.63;
const dueDate = '2022-09-24';

export const PaymentScheduleModal: FC<PaymentScheduleModalProps> = ({ onConfirm }) => {
  const { t } = useTranslation();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const dueDateParsed = parse(dueDate, 'yyyy-MM-dd', new Date());
  const PaymentScheduleFormSchema = getPaymentScheduleFormSchema(dueDateParsed);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<PaymentScheduleFormData>({
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: {
      amount: 0,
      paymentOption: PaymentOption.BALANCE_OWED,
      scheduledDate: format(dueDateParsed, 'MMddyyyy'),
    },
    resolver: yupResolver(PaymentScheduleFormSchema),
  });

  const onSubmit = handleSubmit((data) => {
    let amount = data.amount;

    if (data.paymentOption === PaymentOption.BALANCE_OWED) {
      amount = balanceOwed;
    }
    if (data.paymentOption === PaymentOption.BALANCE_WITH_INTEREST) {
      amount = balanceWithInterest;
    }
    if (data.paymentOption === PaymentOption.FULL_BALANCE) {
      amount = fullBalance;
    }

    onConfirm(amount, data.scheduledDate);
  });

  return (
    <PaymentScheduleModalStyled>
      <ParagraphM weight={800} className="title">
        {t('payment_modal.payment_schedule.title')}
      </ParagraphM>
      <ParagraphS weight={600}>{t('payment_modal.payment_schedule.credit_for', { name })}</ParagraphS>
      <ParagraphXS>{t('payment_modal.payment_schedule.last_payment', { lastPayment, date })}</ParagraphXS>
      <ParagraphXS>{t('payment_modal.payment_schedule.interest_owed', { iterestOwed })}</ParagraphXS>
      <div className="divider" />
      <ParagraphXS weight={800} className="subtitle">
        {t('payment_modal.payment_schedule.payment_date')}
      </ParagraphXS>
      <form onSubmit={onSubmit}>
        <div className="payment-date">
          <ParagraphXS>{format(dueDateParsed, 'MMMM dd, yyyy')} |</ParagraphXS>
          <InputText small>
            <Controller
              control={control}
              name="scheduledDate"
              render={({ field: { onChange, value } }) => {
                return scheduleOpen ? (
                  <ReactInput
                    value={value}
                    placeholder={t('kyc_step.placeholder.date_of_birth')}
                    onChange={onChange}
                    parse={templateParser('xx-xx-xxxx', parseDigit)}
                    format={templateFormatter('xx-xx-xxxx')}
                  />
                ) : (
                  <button className="btn-schedule" onClick={() => setScheduleOpen(true)}>
                    {t('payment_modal.payment_schedule.schedule')} <Icon name="calendar" />
                  </button>
                );
              }}
            />
          </InputText>
          {errors.scheduledDate?.message && <FormError>{t(errors.scheduledDate.message)}</FormError>}
        </div>
        <InputRadio small>
          <input type="radio" value="auto_payments" checked disabled />
          <ParagraphXXS>
            {t('dashboard_payment.auto_payments')} {t('off')} {/* I guess temp */}
          </ParagraphXXS>
        </InputRadio>
        <div className="divider" />
        <ParagraphXS weight={800} className="subtitle">
          {t('payment_modal.payment_schedule.payment_options')}
        </ParagraphXS>

        <div className="radio-group">
          <InputRadio>
            <input type="radio" value={PaymentOption.BALANCE_OWED} {...register('paymentOption')} />
            <ParagraphS>{t('payment_modal.payment_schedule.balance_owed', { balanceOwed })}</ParagraphS>
          </InputRadio>
          <InputRadio>
            <input type="radio" value={PaymentOption.BALANCE_WITH_INTEREST} {...register('paymentOption')} />
            <ParagraphS>
              {t('payment_modal.payment_schedule.balance_with_interest', { balanceWithInterest })}
            </ParagraphS>
          </InputRadio>
          <InputRadio>
            <input type="radio" value={PaymentOption.FULL_BALANCE} {...register('paymentOption')} />
            <ParagraphS>{t('payment_modal.payment_schedule.full_balance', { fullBalance })}</ParagraphS>
          </InputRadio>
          <div className="input-group">
            <InputRadio>
              <input type="radio" value={PaymentOption.CUSTOM} {...register('paymentOption')} />
              <ParagraphS>{t('payment_modal.payment_schedule.other_amount')}</ParagraphS>
            </InputRadio>
            $
            <InputText small>
              <input placeholder="100" {...register('amount')} />
            </InputText>
            {errors.amount?.message && <FormError>{t(errors.amount.message)}</FormError>}
          </div>
        </div>
        <div className="btn-group">
          <ButtonPrimary type="submit" maxWidth="250px" isDisabled={!isValid}>
            {t('btn_next')}
          </ButtonPrimary>
        </div>
      </form>
    </PaymentScheduleModalStyled>
  );
};
