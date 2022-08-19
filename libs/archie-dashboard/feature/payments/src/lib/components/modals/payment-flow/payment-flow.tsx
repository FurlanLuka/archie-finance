import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { MakePaymentModal } from '@archie-webapps/archie-dashboard/components';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { ConnectAccount } from '../../connect-account/connect-acount';

interface PaymentFlowModalProps {
  close: VoidFunction;
}

export const PaymentFlowModal: FC<PaymentFlowModalProps> = ({ close }) => {
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  if (getConnectedAccountsResponse.state === RequestState.LOADING) {
    return <Loader />;
  }

  if (getConnectedAccountsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
  }

  if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
    // Rework all of this

    if (getConnectedAccountsResponse.data.length === 0) {
      return (
        <Modal maxWidth="760px" isOpen close={close}>
          <ConnectAccount />
        </Modal>
      );
    }

    return <MakePaymentModal isOpen close={close} onConfirm={() => console.log('confirmed')} />;
  }

  return <></>;
};
