import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AvailableCredit,
  NextPayment,
  InterestRate,
} from '@archie/ui/dashboard/components';
import { MakePaymentModal } from '@archie/ui/dashboard/feature/make-payment';
import { canUserSchedulePayment } from '@archie/ui/dashboard/utils';
import { useGetAutopay } from '@archie/ui/shared/data-access/archie-api/autopay/hooks/use-get-autopay';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetObligations } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import {
  ButtonPrimary,
  Status,
  StatusCircle,
  TitleM,
  BodyS,
} from '@archie/ui/shared/design-system';

import { ConnectedAccounts } from '../components/connected-accounts/connected-accounts';

import { PaymentScreenStyled } from './payment.styled';

export const PaymentScreen: FC = () => {
  const { t } = useTranslation();
  const getObligationsResponse = useGetObligations();
  const getAutopayResponse = useGetAutopay();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);

  const isAutopayOn = () => {
    if (getAutopayResponse.state === RequestState.SUCCESS) {
      if (getAutopayResponse.data === null) {
        return false;
      }
      return true;
    }

    return false;
  };

  return (
    <PaymentScreenStyled>
      <TitleM className="title">{t('dashboard_payment.title')}</TitleM>
      <div className="section-cards">
        <AvailableCredit />
        <div className="cards-group">
          <NextPayment />
          <InterestRate />
        </div>
      </div>
      <div className="section-actions">
        <ButtonPrimary
          onClick={() => setMakePaymentModalOpen(true)}
          isDisabled={
            getObligationsResponse.state !== RequestState.SUCCESS ||
            !canUserSchedulePayment(getObligationsResponse.data)
          }
        >
          {t('dashboard_payment.btn_pay')}
        </ButtonPrimary>
        <Status isOn={isAutopayOn()}>
          <StatusCircle />
          <BodyS weight={700}>
            {t('dashboard_payment.auto_payments')}{' '}
            {t(isAutopayOn() ? 'on' : 'off')}
          </BodyS>
        </Status>
      </div>
      <ConnectedAccounts />
      {makePaymentModalOpen && (
        <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />
      )}
    </PaymentScreenStyled>
  );
};
