import { FC } from 'react';

import { BodyM } from '@archie-webapps/shared/ui/design-system';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';

import { ConnectableAccountItemStyled } from './connectable-account-item.styled';

interface ConnectableAccountItemProps {
  account: AccountResponse;
}

export const ConnectableAccountItem: FC<ConnectableAccountItemProps> = ({ account }) => (
  <ConnectableAccountItemStyled>
    <div className="circle" />
    <div className="account-info">
      <BodyM weight={700}>{account.name}</BodyM>
      <BodyM className="subtitle">
        {account.name} ...{account.mask}
      </BodyM>
    </div>
  </ConnectableAccountItemStyled>
);
