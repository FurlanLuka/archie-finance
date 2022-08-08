import { FC } from 'react';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-accounts';
import { Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { AccountConnect } from '../../account-connect/account-connect';
import { PlaidLink } from '../../plaid-link/plaid-link';

interface ConnectAccountModalProps {
  close: VoidFunction;
}
export const ConnectAccountModal: FC<ConnectAccountModalProps> = ({ close }) => {
  const getAccountsResponse = useGetAccounts();

  function getContent() {
    if (getAccountsResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getAccountsResponse.state === RequestState.ERROR) {
      // TODO error handling
      return <div>Something went wrong :(</div>;
    }

    if (getAccountsResponse.state === RequestState.SUCCESS) {
      if (getAccountsResponse.data.length === 0) {
        return <PlaidLink />;
      }

      return <AccountConnect accounts={getAccountsResponse.data} />;
    }

    return null;
  }
  return (
    <Modal isOpen close={close} maxWidth="800px">
      {getContent()}
    </Modal>
  );
};
