import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AvailableCredit, NextPayment, InterestRate } from '@archie-webapps/archie-dashboard/components';
import { MakePaymentModal } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { canUserSchedulePayment } from '@archie-webapps/archie-dashboard/utils';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import { ButtonPrimary, Status, StatusCircle, TitleM, BodyS } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccounts } from '../components/connected-accounts/connected-accounts';

import { PaymentScreenStyled } from './payment.styled';

export const PaymentScreen: FC = () => {
  const { t } = useTranslation();
  const getObligationsResponse = useGetObligations();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);

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
        <Status isOn>
          <StatusCircle />
          <BodyS weight={700}>
            {t('dashboard_payment.auto_payments')} {t('on')} {/* TBD */}
          </BodyS>
        </Status>
      </div>
      <ConnectedAccounts />
      {makePaymentModalOpen && <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />}
    </PaymentScreenStyled>
  );
};
