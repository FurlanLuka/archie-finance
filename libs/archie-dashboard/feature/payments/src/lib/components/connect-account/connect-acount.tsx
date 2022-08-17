import { FC, useState } from 'react';

import { AccountSelect } from '../account-select/account-select';
import { PlaidLink } from '../plaid-link/plaid-link';

const LAST_ITEM_LS = 'last_itemId';

interface ConnectAccountProps {
  onAccountConnect?: VoidFunction;
}

export const ConnectAccount: FC<ConnectAccountProps> = ({ onAccountConnect }) => {
  const [itemId, setItemId] = useState<string | null>(() => {
    const lsItem = localStorage.getItem(LAST_ITEM_LS);

    if (lsItem !== null && lsItem.length > 0) {
      return lsItem;
    }

    return null;
  });

  const onAccessTokenCreate = (itemId: string) => {
    localStorage.setItem(LAST_ITEM_LS, itemId);
    setItemId(itemId);
  };

  const onConnect = () => {
    localStorage.removeItem(LAST_ITEM_LS);
    onAccountConnect?.();
  };

  function getContent() {
    if (itemId) {
      return <AccountSelect itemId={itemId} onConnect={onConnect} />;
    }

    return <PlaidLink onAccessTokenCreate={onAccessTokenCreate} />;
  }

  return getContent();
};
