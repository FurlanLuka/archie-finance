import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { AccountResponse } from '@archie/ui/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { useDisconnectAccount } from '@archie/ui/shared/data-access/archie-api/plaid/hooks/use-disconnect-account';
import {
  ButtonOutline,
  BodyM,
} from '@archie/ui/shared/ui/design-system';
import { theme } from '@archie/ui/shared/ui/theme';

import { ConnectedAccountStyled } from './connected-account.styled';

interface ConnectedAccountProps {
  account: AccountResponse;
}

export const ConnectedAccount: FC<ConnectedAccountProps> = ({ account }) => {
  const { t } = useTranslation();
  const disconnectAccountMutation = useDisconnectAccount(account.id);

  const handleRemoveClick = () => {
    if (disconnectAccountMutation.state === RequestState.IDLE) {
      disconnectAccountMutation.mutate({});
    }
  };

  return (
    <ConnectedAccountStyled>
      <BodyM weight={700}>{account.name}</BodyM>
      <BodyM className="account-details">...{account.mask}</BodyM>
      <ButtonOutline
        small
        color={theme.textPositive}
        className="remove-account"
        onClick={handleRemoveClick}
        isLoading={disconnectAccountMutation.state === RequestState.LOADING}
      >
        {t('dashboard_payment.connected_accounts.btn_disconnect')}
      </ButtonOutline>
    </ConnectedAccountStyled>
  );
};
