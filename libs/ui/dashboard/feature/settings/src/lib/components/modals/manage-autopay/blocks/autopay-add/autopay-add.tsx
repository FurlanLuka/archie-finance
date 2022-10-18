import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { ConnectAccountModal } from '@archie-microservices/ui/dashboard/feature/make-payment';
import { RequestState } from '@archie-microservices/ui/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-microservices/ui/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader } from '@archie-microservices/ui/shared/ui/design-system';

import { SetupAutopay } from './blocks/setup-autopay/setup-autopay';

interface AutopayAddProps {
  close: () => void;
}

export const AutopayAdd: FC<AutopayAddProps> = ({ close }) => {
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  if (getConnectedAccountsResponse.state === RequestState.LOADING) {
    return <Loader marginAuto />;
  }

  if (getConnectedAccountsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
  }

  if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
    if (getConnectedAccountsResponse.data.length === 0) {
      return <ConnectAccountModal close={close} />;
    }

    return (
      <SetupAutopay
        accounts={getConnectedAccountsResponse.data}
        onSuccess={close}
      />
    );
  }

  return <></>;
};
