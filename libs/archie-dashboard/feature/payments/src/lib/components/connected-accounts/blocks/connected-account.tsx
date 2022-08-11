import { FC } from 'react';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { ButtonOutline, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { ConnectedAccountStyled } from './connected-account.styled';

interface ConnectedAccountProps {
  account: AccountResponse;
}

export const ConnectedAccount: FC<ConnectedAccountProps> = ({ account }) => {
  return (
    <ConnectedAccountStyled>
      <ParagraphXS weight={700}>{account.name}</ParagraphXS>
      <ParagraphXS className="account-details">...${account.mask}</ParagraphXS>
      <ButtonOutline small color={theme.textPositive} className="remove-account" maxWidth="fit-content">
        Remove
      </ButtonOutline>
    </ConnectedAccountStyled>
  );
};
