import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import { Loader, Modal, ParagraphM, ParagraphS, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { PaymentSteps } from './blocks/payment-steps/payment-steps';
import { MakePaymentStyled } from './make-payment.styled';

interface MakePaymentModalProps {
  close: () => void;
}

export const MakePaymentModal: FC<MakePaymentModalProps> = ({ close }) => {
  const { t } = useTranslation();
  const getKycResponse = useGetKyc();
  const getObligationsResponse = useGetObligations();

  const getContent = () => {
    if (getKycResponse.state === RequestState.LOADING || getObligationsResponse.state === RequestState.LOADING) {
      return <Loader className="loader" />;
    }

    if (getKycResponse.state === RequestState.ERROR || getObligationsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS && getObligationsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('payment_modal.payment_schedule.title')}
          </ParagraphM>
          <ParagraphS weight={600}>
            {t('payment_modal.payment_schedule.credit_for', { name: getKycResponse.data.firstName })}
          </ParagraphS>
          {/*<ParagraphXS>{t('payment_modal.payment_schedule.last_payment', { lastPayment, date })}</ParagraphXS>*/}
          <ParagraphXS>
            {t('payment_modal.payment_schedule.interest_owed', {
              interestOwed: getObligationsResponse.data.interestOwed,
            })}
          </ParagraphXS>
          <div className="divider" />
          <PaymentSteps obligations={getObligationsResponse.data} close={close} />
        </>
      );
    }

    return <></>;
  };

  return (
    <Modal isOpen close={close} maxWidth="780px">
      <MakePaymentStyled>{getContent()}</MakePaymentStyled>
    </Modal>
  );
};
