import { FC } from 'react';

import { ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { ConnectableAccount } from '../../../interfaces';

import { ConnectableAccountItemStyled } from './connectable-account-item.styled';

interface ConnectableAccountItemProps {
  account: ConnectableAccount;
}
export const ConnectableAccountItem: FC<ConnectableAccountItemProps> = ({ account }) => {
  return (
    <ConnectableAccountItemStyled>
      <div className="circle" />
      <div className="account-info">
        <ParagraphXS weight={700}>{account.name}</ParagraphXS>
        <ParagraphXS className="subtitle">
          {account.name} ...{account.mask}
        </ParagraphXS>
      </div>
    </ConnectableAccountItemStyled>
  );
};
