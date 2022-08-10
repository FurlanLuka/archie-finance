import { FC, useState } from 'react';

import { AccountSelect } from '../account-select/account-select';
import { PlaidLink } from '../plaid-link/plaid-link';

export const ConnectAccount: FC = () => {
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

  function getContent() {
    if (itemId) {
      return <AccountSelect itemId={itemId} />;
    }

    return <PlaidLink onAccessTokenCreate={onAccessTokenCreate} />;
  }

  return getContent();
};
