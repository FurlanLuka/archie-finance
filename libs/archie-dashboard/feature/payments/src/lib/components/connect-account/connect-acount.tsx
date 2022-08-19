import { FC, useState } from 'react';

import { AccountSelect } from '../account-select/account-select';
import { ConnectableAccount } from '../interfaces';
import { PlaidLink } from '../plaid-link/plaid-link';

const LAST_ITEM_LS = 'last_itemId';

interface ConnectAccountProps {
  onAccountConnect?: VoidFunction;
}

export const ConnectAccount: FC<ConnectAccountProps> = ({ onAccountConnect }) => {
  const [availableAccounts, setAvailableAccounts] = useState();
  const [itemId, setItemId] = useState<string | null>(() => {
    const lsItem = localStorage.getItem(LAST_ITEM_LS);

    if (lsItem !== null && lsItem.length > 0) {
      return lsItem;
    }

    return null;
  });

  const onLinkSuccess = (publicToken: string, availableAccounts: ConnectableAccount[]) => {
    setItemId(itemId);
  };

  const onConnect = () => {
    localStorage.removeItem(LAST_ITEM_LS);
    onAccountConnect?.();
  };

  const getContent = () => {
    if (itemId) {
      return <AccountSelect itemId={itemId} onConnect={onConnect} />;
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
