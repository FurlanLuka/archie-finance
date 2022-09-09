import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Modal, Loader } from '@archie-webapps/shared/ui/design-system';

import { ConnectAccountModal } from '../connect-account/connect-acount';
import { SchedulePaymentModal } from '../schedule-payment/schedule-payment';

interface MakePaymentModalProps {
  close: VoidFunction;
}

export const MakePaymentModal: FC<MakePaymentModalProps> = ({ close }) => {
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  if (getConnectedAccountsResponse.state === RequestState.LOADING) {
    return (
      <Modal maxWidth="760px" isOpen close={close}>
        <Loader marginAuto />
      </Modal>
    );
  }

  if (getConnectedAccountsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
  }

  if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
    if (getConnectedAccountsResponse.data.length === 0) {
      return <ConnectAccountModal close={close} />;
    }

    return <SchedulePaymentModal close={close} />;
  }

  return <></>;
};
