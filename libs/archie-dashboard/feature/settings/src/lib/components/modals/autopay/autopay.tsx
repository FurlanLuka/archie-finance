import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { PlaidLink } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { SetupAutopay } from './blocks/setup-autopay/setup-autopay';
import { ConnectableAccount } from './autopay.interfaces';

interface AutopayModalProps {
  close: () => void;
}

export const AutopayModal: FC<AutopayModalProps> = ({ close }) => {
  const [availableAccounts, setAvailableAccounts] = useState<ConnectableAccount[]>([]);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  const onLinkSuccess = (publicToken: string, availableAccounts: ConnectableAccount[]) => {
    setAvailableAccounts(availableAccounts);
    setPublicToken(publicToken);
  };

  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const getContent = () => {
    if (getConnectedAccountsResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getConnectedAccountsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
    }

    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      if (publicToken && availableAccounts.length > 0) {
        return <SetupAutopay accounts={availableAccounts} publicToken={publicToken} onConnect={close} />;
      }

      return <PlaidLink onLinkSuccess={onLinkSuccess} />;
    }

    return <></>;
  };

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      {getContent()}
    </Modal>
  );
};
