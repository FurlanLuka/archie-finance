import { FC, useState } from 'react';

import { ConnectableAccount } from './connect-acount.interfaces';
import { ConnectableAccountSelect } from './components/connectable-account-select/connectable-account-select';
import { PlaidLink } from './components/plaid-link/plaid-link';

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
