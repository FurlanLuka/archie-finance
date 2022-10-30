import { FC } from 'react';

import { AccountResponse } from '@archie/ui/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { BodyM } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { ConnectedAccountItemStyled } from './connected-account-item.styled';

interface ConnectedAccountItemProps {
  account: AccountResponse;
}
// TODO move this and the components lib one into a new lib
// DONT TOUCH without moving, circular dependency
export const ConnectedAccountItem: FC<ConnectedAccountItemProps> = ({
  account,
}) => (
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
