import { FC, useState } from 'react';

import { AccountSelect } from '../account-select/account-select';
import { PlaidLink } from '../plaid-link/plaid-link';

interface ConnectAccountProps {
  onAccountConnect?: VoidFunction;
}
export const ConnectAccount: FC<ConnectAccountProps> = ({ onAccountConnect }) => {
  const [itemId, setItemId] = useState<string | null>(() => {
    const lsItem = localStorage.getItem('last_itemId');
    if (lsItem !== null && lsItem.length > 0) {
      return lsItem;
    }

    return null;
  });

  const onAccessTokenCreate = (itemId: string) => {
    localStorage.setItem('last_itemId', itemId);
    setItemId(itemId);
  };

  const onConnect = () => {
    localStorage.removeItem('last_itemId');
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
