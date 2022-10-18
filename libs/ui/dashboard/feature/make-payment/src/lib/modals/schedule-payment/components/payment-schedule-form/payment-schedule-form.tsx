import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, format, isValid, parse } from 'date-fns';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Kyc } from '@archie-microservices/ui/shared/data-access/archie-api/kyc/api/get-kyc';
import { UserObligations } from '@archie-microservices/ui/shared/data-access/archie-api/payment/api/get-obligations';
import {
  ButtonPrimary,
  FormError,
  InputRadio,
  InputText,
  Status,
  StatusCircle,
  TitleS,
  BodyL,
  BodyM,
  BodyS,
} from '@archie-microservices/ui/shared/ui/design-system';

import { PaymentOption } from './payment-schedule-form.interfaces';
import {
  PaymentScheduleFormData,
  getPaymentScheduleFormSchema,
} from './payment-schedule-form.schema';
import { PaymentScheduleFormStyled } from './payment-schedule-form.styled';

interface PaymentScheduleFormProps {
  onConfirm: (amount: number, date: string) => void;
  obligations: UserObligations;
  kycData: Kyc;
}

export const PaymentScheduleForm: FC<PaymentScheduleFormProps> = ({
  obligations,
  kycData,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const today = new Date();

  const { balanceOwed, dueDate, fullBalance } = obligations;
  const PaymentScheduleFormSchema = getPaymentScheduleFormSchema(
    dueDate,
    fullBalance,
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid: isFormValid },
    trigger,
  } = useForm<PaymentScheduleFormData>({
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: {
      amount: balanceOwed > 0 ? balanceOwed : fullBalance,
      paymentOption:
        balanceOwed > 0
          ? PaymentOption.BALANCE_OWED
          : PaymentOption.FULL_BALANCE,
      scheduledDate: dueDate,
    },
    resolver: yupResolver(PaymentScheduleFormSchema),
  });

  const onSubmit = handleSubmit((data) => {
    let amount = data.amount;

    if (data.paymentOption === PaymentOption.BALANCE_OWED) {
      amount = balanceOwed;
    }
    if (data.paymentOption === PaymentOption.FULL_BALANCE) {
      amount = fullBalance;
    }

    onConfirm(amount, format(data.scheduledDate, 'yyyy-MM-dd'));
  });

  useEffect(() => {
    // react hook form has isValid=false initially
    // and the first validation happens once a field is dirty onChange/Blur
    // so here we validate the form on mount
    trigger();
  }, [trigger]);

  return (
    <PaymentScheduleFormStyled>
      <TitleS className="title">
        {t('payment_modal.payment_schedule.title')}
      </TitleS>
      <BodyL weight={600}>
        {t('payment_modal.credit_for', { name: kycData.firstName })}
      </BodyL>
      <BodyM>
        {t('payment_modal.interest_owed', {
          interestOwed: obligations.interestOwed,
        })}
      </BodyM>
      <div className="divider" />
      <BodyM weight={800} className="subtitle">
        {t('payment_modal.payment_schedule.payment_date')}
      </BodyM>
      <form onSubmit={onSubmit}>
        <div className="payment-date">
          <BodyM>
            {t('payment_modal.payment_schedule.due_date', {
              date: format(dueDate, 'MMMM dd, yyyy'),
            })}
          </BodyM>
          <InputText small>
            <Controller
              control={control}
              name="scheduledDate"
              render={({ field: { onChange, value } }) => {
                return (
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = parse(
                        e.target.value,
                        'yyyy-MM-dd',
                        new Date(),
                      );

                      if (isValid(date)) {
                        onChange(date);
                      }
                    }}
                    value={format(value, 'yyyy-MM-dd')}
                    min={format(addDays(today, 1), 'yyyy-MM-dd')}
                    max={format(dueDate, 'yyyy-MM-dd')}
                    required
                  />
                );
              }}
            />
          </InputText>
          {errors.scheduledDate?.message && (
            <FormError>{t(errors.scheduledDate.message)}</FormError>
          )}
        </div>
        <Status>
          <StatusCircle />
          <BodyS weight={700}>
            {t('dashboard_payment.auto_payments')} {t('off')} {/* TBD */}
          </BodyS>
        </Status>
        <div className="divider" />
        <BodyM weight={800} className="subtitle">
          {t('payment_modal.payment_schedule.payment_options')}
        </BodyM>

        <div className="radio-group">
          <InputRadio>
            <input
              type="radio"
              value={PaymentOption.BALANCE_OWED}
              {...register('paymentOption')}
              disabled={balanceOwed === 0}
            />
            <BodyL className={balanceOwed === 0 ? 'disabled' : ''}>
              {t('payment_modal.payment_schedule.balance_owed', {
                balanceOwed,
              })}
            </BodyL>
          </InputRadio>
          <InputRadio>
            <input
              type="radio"
              value={PaymentOption.FULL_BALANCE}
              {...register('paymentOption')}
            />
            <BodyL>
              {t('payment_modal.payment_schedule.full_balance', {
                fullBalance,
              })}
            </BodyL>
          </InputRadio>
          <div className="input-group">
            <InputRadio>
              <input
                type="radio"
                value={PaymentOption.CUSTOM}
                {...register('paymentOption')}
              />
              <BodyL>{t('payment_modal.payment_schedule.other_amount')}</BodyL>
            </InputRadio>
            $
            <InputText small>
              <input
                placeholder="100"
                {...register('amount')}
                className="amount"
              />
            </InputText>
            {errors.amount?.message && (
              <FormError>{t(errors.amount.message)}</FormError>
            )}
          </div>
        </div>
        <div className="btn-group">
          <ButtonPrimary type="submit" width="250px" isDisabled={!isFormValid}>
            {t('btn_next')}
          </ButtonPrimary>
        </div>
      </form>
    </PaymentScheduleFormStyled>
  );
};
