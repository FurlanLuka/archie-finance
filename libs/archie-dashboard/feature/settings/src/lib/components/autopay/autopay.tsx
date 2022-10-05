import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { ConnectAccountModal } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader } from '@archie-webapps/shared/ui/design-system';

import { SetupAutopay } from './blocks/setup-autopay/setup-autopay';

interface AutopayProps {
  close: () => void;
}

export const Autopay: FC<AutopayProps> = ({ close }) => {
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const getContent = () => {
    if (getConnectedAccountsResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getConnectedAccountsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
    }

    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      if (getConnectedAccountsResponse.data.length === 0) {
        return <ConnectAccountModal />;
      }

      return <SetupAutopay accounts={getConnectedAccountsResponse.data} onSuccess={close} />;
    }

    return <></>;
  };

  return getContent();
};
