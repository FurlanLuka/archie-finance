import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { ConnectAccountModal } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { SetupAutopay } from './blocks/setup-autopay/setup-autopay';

interface AutopayModalProps {
  close: () => void;
}

export const AutopayModal: FC<AutopayModalProps> = ({ close }) => {
  const getConnectedAccountsResponse = useGetConnectedAccounts();
  console.log('mwaji akawnti', getConnectedAccountsResponse);

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

      return <SetupAutopay accounts={getConnectedAccountsResponse.data} onConnect={close} />;
    }

    return <></>;
  };

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      {getContent()}
    </Modal>
  );
};
