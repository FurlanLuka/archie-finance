import { FC } from 'react';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { BodyM } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccountItemStyled } from './connected-account-item.styled';
import { theme } from '@archie-webapps/shared/ui/theme';

interface ConnectedAccountItemProps {
  account: AccountResponse;
}

export const ConnectedAccountItem: FC<ConnectedAccountItemProps> = ({ account }) => (
  <ConnectedAccountItemStyled>
    <div className="circle" />
    <div className="account-info">
      <BodyM weight={700}>{account.name}</BodyM>
      <BodyM color={theme.textSecondary}>
        {account.name} ...{account.mask}
      </BodyM>
    </div>
  </ConnectedAccountItemStyled>
);
