import { FC, useState } from 'react';

import { Modal } from '@archie-webapps/shared/ui/design-system';

import { ConnectableAccount } from './connect-acount.interfaces';
import { ConnectableAccountSelect } from './components/connectable-account-select/connectable-account-select';
import { PlaidLink } from './components/plaid-link/plaid-link';

interface ConnectAccountProps {
  close: VoidFunction;
}

export const ConnectAccountModal: FC<ConnectAccountProps> = ({ close }) => {
  const [availableAccounts, setAvailableAccounts] = useState<ConnectableAccount[]>([]);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  const onLinkSuccess = (publicToken: string, availableAccounts: ConnectableAccount[]) => {
    setAvailableAccounts(availableAccounts);
    setPublicToken(publicToken);
  };

  const getContent = () => {
    if (publicToken && availableAccounts.length > 0) {
      return <ConnectableAccountSelect accounts={availableAccounts} publicToken={publicToken} onConnect={close} />;
    }

    return <PlaidLink onLinkSuccess={onLinkSuccess} />;
  };

  return (
    <Modal maxWidth="760px" isOpen close={close}>
      {getContent()}
    </Modal>
  );
};
