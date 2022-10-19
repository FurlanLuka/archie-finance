import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetKyc } from '@archie/ui/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { useGetObligations } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import {
  Loader,
  Modal,
} from '@archie/ui/shared/ui/design-system';

import { PaymentSteps } from './components/payment-steps/payment-steps';
import { SchedulePaymentStyled } from './schedule-payment.styled';

interface SchedulePaymentModalProps {
  close: () => void;
}

export const SchedulePaymentModal: FC<SchedulePaymentModalProps> = ({
  close,
}) => {
  const getKycResponse = useGetKyc();
  const getObligationsResponse = useGetObligations();

  const getContent = () => {
    if (
      getKycResponse.state === RequestState.LOADING ||
      getObligationsResponse.state === RequestState.LOADING
    ) {
      return <Loader marginAuto />;
    }

    if (
      getKycResponse.state === RequestState.ERROR ||
      getObligationsResponse.state === RequestState.ERROR
    ) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (
      getKycResponse.state === RequestState.SUCCESS &&
      getObligationsResponse.state === RequestState.SUCCESS
    ) {
      return (
        <PaymentSteps
          obligations={getObligationsResponse.data}
          kycData={getKycResponse.data}
          close={close}
        />
      );
    }

    return <></>;
  };

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      <SchedulePaymentStyled>{getContent()}</SchedulePaymentStyled>
    </Modal>
  );
};
