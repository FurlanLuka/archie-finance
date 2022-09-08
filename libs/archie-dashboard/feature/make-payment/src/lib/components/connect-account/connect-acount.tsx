import { FC, useState } from 'react';

import { ConnectableAccount } from '../interfaces';
import { PlaidLink } from '../plaid-link/plaid-link';

import { ConnectableAccountSelect } from './blocks/connectable-account-select/connectable-account-select';

interface ConnectAccountProps {
  onAccountConnect?: VoidFunction;
}

export const ConnectAccount: FC<ConnectAccountProps> = ({ onAccountConnect }) => {
  const [availableAccounts, setAvailableAccounts] = useState<ConnectableAccount[]>([]);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  const onLinkSuccess = (publicToken: string, availableAccounts: ConnectableAccount[]) => {
    setAvailableAccounts(availableAccounts);
    setPublicToken(publicToken);
  };

  const getContent = () => {
    if (publicToken && availableAccounts.length > 0) {
      return (
        <ConnectableAccountSelect accounts={availableAccounts} publicToken={publicToken} onConnect={onAccountConnect} />
      );
    }

    return <PlaidLink onLinkSuccess={onLinkSuccess} />;
  };

  // TODO
  return (
    // <Modal maxWidth="760px" isOpen close={close}>
    getContent()
    // </Modal>
  );
};
