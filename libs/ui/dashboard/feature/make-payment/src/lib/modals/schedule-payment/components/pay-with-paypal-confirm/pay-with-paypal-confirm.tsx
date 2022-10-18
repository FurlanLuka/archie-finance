import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Kyc } from '@archie-webapps/shared/data-access/archie-api/kyc/api/get-kyc';
import { usePayWithPaypal } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-pay-with-paypal';
import { UserObligations } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-obligations';
import {
  ButtonOutline,
  ButtonPrimary,
  TitleM,
  TitleS,
  BodyL,
  BodyM,
  FormError,
} from '@archie-microservices/ui/shared/ui/design-system';

import { PayWithPaypalConfirmStyled } from './pay-with-paypal-confirm.styled';

interface PayWithPaypalConfirmProps {
  onConfirm: () => void;
  onBack: () => void;
  obligations: UserObligations;
  kycData: Kyc;
  paymentAmount: number;
}

export const PayWithPaypalConfirm: FC<PayWithPaypalConfirmProps> = ({
  onConfirm,
  onBack,
  obligations,
  kycData,
  paymentAmount,
}) => {
  const { t } = useTranslation();
  const payWithPaypalMutation = usePayWithPaypal();

  useEffect(() => {
    if (payWithPaypalMutation.state === RequestState.SUCCESS) {
      onConfirm();
    }
  }, [payWithPaypalMutation.state, onConfirm]);

  const handleConfirm = () => {
    if (
      payWithPaypalMutation.state === RequestState.IDLE ||
      payWithPaypalMutation.state === RequestState.ERROR
    ) {
      payWithPaypalMutation.mutate({ paymentAmount });
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <PayWithPaypalConfirmStyled>
      <TitleS className="title">
        {t('payment_modal.payment_confirm.title')}
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
      <BodyM weight={800} className="balance-note">
        {t('payment_modal.payment_confirm.balance_note')}
      </BodyM>
      <TitleM weight={400} className="balance-value">
        ${paymentAmount}
      </TitleM>
      <BodyM>{t('payment_modal.pay_with_paypal_form.time_note')}</BodyM>
      {payWithPaypalMutation.state === RequestState.ERROR && (
        <FormError>{t('error.try_again')}</FormError>
      )}
      <div className="btn-group">
        <ButtonPrimary width="100%" onClick={handleConfirm}>
          {t('payment_modal.pay_with_paypal_form.btn')}
        </ButtonPrimary>
        <ButtonOutline
          width="100%"
          onClick={handleBack}
          isDisabled={payWithPaypalMutation.state === RequestState.LOADING}
        >
          {t('btn_back')}
        </ButtonOutline>
      </div>
    </PayWithPaypalConfirmStyled>
  );
};
