import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { PaymentSteps } from './components/payment-steps/payment-steps';
import { MakePaymentStyled } from './make-payment.styled';

interface MakePaymentModalProps {
  close: () => void;
}

export const MakePaymentModal: FC<MakePaymentModalProps> = ({ close }) => {
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
      return <PaymentSteps obligations={getObligationsResponse.data} kycData={getKycResponse.data} close={close} />;
    }

    return <></>;
  };

  return (
    <Modal isOpen close={close} maxWidth="780px">
      <MakePaymentStyled>{getContent()}</MakePaymentStyled>
    </Modal>
  );
};
