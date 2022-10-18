import { FC, useState } from 'react';

import { AccountResponse } from '@archie-microservices/ui/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { Modal } from '@archie-microservices/ui/shared/ui/design-system';

import { ConnectableAccountSelect } from './components/connectable-account-select/connectable-account-select';
import { PlaidLink } from './components/plaid-link/plaid-link';

interface ConnectAccountProps {
  close?: VoidFunction;
}

export const ConnectAccountModal: FC<ConnectAccountProps> = ({ close }) => {
  const [availableAccounts, setAvailableAccounts] = useState<AccountResponse[]>(
    [],
  );
  const [publicToken, setPublicToken] = useState<string | null>(null);

  const onLinkSuccess = (
    publicToken: string,
    availableAccounts: AccountResponse[],
  ) => {
    setAvailableAccounts(availableAccounts);
    setPublicToken(publicToken);
  };

  const getContent = () => {
    if (publicToken && availableAccounts.length > 0) {
      return (
        <ConnectableAccountSelect
          accounts={availableAccounts}
          publicToken={publicToken}
          onConnect={close}
        />
      );
    }

    return <PlaidLink onLinkSuccess={onLinkSuccess} />;
  };

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      {getContent()}
    </Modal>
  );
};
