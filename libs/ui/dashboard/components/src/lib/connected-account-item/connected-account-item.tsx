import { FC } from 'react';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { BodyM } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { ConnectedAccountItemStyled } from './connected-account-item.styled';

interface ConnectedAccountItemProps {
  account: PaymentInstrument;
}

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
