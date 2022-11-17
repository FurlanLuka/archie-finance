import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';
import { UserObligations } from '@archie/ui/shared/data-access/archie-api/payment/api/get-obligations';
import {
  ButtonPrimary,
  FormError,
  InputRadio,
  InputText,
  TitleS,
  BodyL,
  BodyM,
} from '@archie/ui/shared/design-system';

import { PaymentOption } from './pay-with-paypal-form.interfaces';
import {
  PayWithPaypalFormData,
  getPayWithPaypalFormSchema,
} from './pay-with-paypal-form.schema';
import { PayWithPaypalFormStyled } from './pay-with-paypal-form.styled';

interface PayWithPaypalFormProps {
  onConfirm: (amount: number) => void;
  obligations: UserObligations;
  kycData: KycResponse;
}

export const PayWithPaypalForm: FC<PayWithPaypalFormProps> = ({
  obligations,
  kycData,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const { balanceOwed, fullBalance } = obligations;
  const PaymentScheduleFormSchema = getPayWithPaypalFormSchema(fullBalance);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid: isFormValid },
    trigger,
  } = useForm<PayWithPaypalFormData>({
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: {
      amount: balanceOwed > 0 ? balanceOwed : fullBalance,
      paymentOption:
        balanceOwed > 0
          ? PaymentOption.BALANCE_OWED
          : PaymentOption.FULL_BALANCE,
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

    onConfirm(amount);
  });

  useEffect(() => {
    // react hook form has isValid=false initially
    // and the first validation happens once a field is dirty onChange/Blur
    // so here we validate the form on mount
    trigger();
  }, [trigger]);

  return (
    <PayWithPaypalFormStyled>
      <TitleS className="title">
        {t('payment_modal.pay_with_paypal_form.title')}
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
      <form onSubmit={onSubmit}>
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
    </PayWithPaypalFormStyled>
  );
};
