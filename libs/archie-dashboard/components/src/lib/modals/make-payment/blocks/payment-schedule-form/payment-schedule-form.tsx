import { yupResolver } from '@hookform/resolvers/yup';
import { format, parse } from 'date-fns';
import { parseDigit, templateFormatter, templateParser } from 'input-format';
import ReactInput from 'input-format/react';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ButtonPrimary,
  FormError,
  InputRadio,
  InputText,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
} from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';

import { Balances } from '../../make-payment.interfaces';

import { PaymentOption } from './payment-schedule-form.interfaces';
import { PaymentScheduleFormData, getPaymentScheduleFormSchema } from './payment-schedule-form.schema';
import { PaymentScheduleFormStyled } from './payment-schedule-form.styled';

interface PaymentScheduleFormProps {
  onConfirm: (amount: number, date: string) => void;
  balances: Balances;
}

export const PaymentScheduleForm: FC<PaymentScheduleFormProps> = ({ balances, onConfirm }) => {
  const { balanceOwed, balanceWithInterest, dueDate, fullBalance } = balances;
  const { t } = useTranslation();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const dueDateParsed = parse(dueDate, 'yyyy-MM-dd', new Date());
  const PaymentScheduleFormSchema = getPaymentScheduleFormSchema(dueDateParsed);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
    trigger,
  } = useForm<PaymentScheduleFormData>({
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: {
      amount: balanceOwed,
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

  useEffect(() => {
    // to validate the form initially, otherwise it's marked as invalid
    trigger();
  }, [trigger]);
  console.log('errars', { isValid, errors });

  return (
    <PaymentScheduleFormStyled>
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
              <input placeholder="100" {...register('amount')} className="amount" />
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
    </PaymentScheduleFormStyled>
  );
};
