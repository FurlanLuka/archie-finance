import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { ConnectAccount } from '../../connect-account/connect-acount';
import { SchedulePayment } from '../../schedule-payment/schedule-payment';

interface PaymentFlowModalProps {
  close: VoidFunction;
}

export const PaymentFlowModal: FC<PaymentFlowModalProps> = ({ close }) => {
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const getContent = () => {
    if (getConnectedAccountsResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getConnectedAccountsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      if (getConnectedAccountsResponse.data.length === 0) {
        return <ConnectAccount />;
      }

      return <SchedulePayment connectedAccounts={getConnectedAccountsResponse.data} />;
    }

    return null;
  };

  return (
    <Modal isOpen close={close} maxWidth="760px">
      {getContent()}
    </Modal>
  );
};
