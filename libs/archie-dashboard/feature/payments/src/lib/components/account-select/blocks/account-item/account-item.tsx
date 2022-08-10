import { FC } from 'react';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { AccountItemStyled } from './account-item.styled';

interface AccountItemProps {
  account: AccountResponse;
}
export const AccountItem: FC<AccountItemProps> = ({ account }) => (
  <AccountItemStyled>
    <div className="circle" />
    <div className="account-info">
      <ParagraphXS weight={700}>{account.name}</ParagraphXS>
      <ParagraphXS className="subtitle">
        {account.name} ...${account.mask}
      </ParagraphXS>
    </div>
    <div className="account-balance">
      {/* Handle currency */}
      <ParagraphXS weight={700}>${account.availableBalance}</ParagraphXS>
      <ParagraphXS className="subtitle">Funds available</ParagraphXS>
    </div>
  </AccountItemStyled>
);
