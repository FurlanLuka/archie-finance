import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AvailableCredit, NextPayment, InterestRate } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import { UserObligations } from '@archie-webapps/shared/data-access/archie-api/payment/payment.interfaces';
import { ButtonPrimary, InputRadio, SubtitleS, ParagraphXXS } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccounts } from '../components/connected-accounts/connected-accounts';
import { PaymentFlowModal } from '../components/modals/payment-flow/payment-flow';

import { PaymentScreenStyled } from './payment.styled';

const canUserSchedulePayment = (obligations: UserObligations) => {
  return obligations.fullBalance > 0;
};

export const PaymentScreen: FC = () => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const getObligationsResponse = useGetObligations();

  return (
    <PaymentScreenStyled>
      <SubtitleS className="title">{t('dashboard_payment.title')}</SubtitleS>
      <div className="section-cards">
        <AvailableCredit />
        <div className="cards-group">
          <NextPayment />
          <InterestRate />
        </div>
      </div>
      <div className="section-actions">
        <ButtonPrimary
          onClick={() => setShowModal(true)}
          isDisabled={
            getObligationsResponse.state !== RequestState.SUCCESS || canUserSchedulePayment(getObligationsResponse.data)
          }
        >
          {t('dashboard_payment.btn_pay')}
        </ButtonPrimary>
        <InputRadio small>
          <input type="radio" value="auto_payments" checked />
          <ParagraphXXS>
            {t('dashboard_payment.auto_payments')} {t('on')} {/* TBD */}
          </ParagraphXXS>
        </InputRadio>
      </div>
      <ConnectedAccounts />
      {showModal && <PaymentFlowModal close={() => setShowModal(false)} />}
    </PaymentScreenStyled>
  );
};
