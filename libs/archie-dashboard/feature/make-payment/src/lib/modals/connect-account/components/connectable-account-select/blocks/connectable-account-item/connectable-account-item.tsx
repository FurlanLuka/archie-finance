import { FC } from 'react';

import { BodyM } from '@archie-webapps/shared/ui/design-system';

import { ConnectableAccount } from '../../../../connect-acount.interfaces';

import { ConnectableAccountItemStyled } from './connectable-account-item.styled';

interface ConnectableAccountItemProps {
  account: ConnectableAccount;
}

export const ConnectableAccountItem: FC<ConnectableAccountItemProps> = ({ account }) => {
  return (
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
};
