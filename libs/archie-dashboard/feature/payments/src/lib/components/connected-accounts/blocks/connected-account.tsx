import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { useDisconnectAccount } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-disconnect-account';
import { ButtonOutline, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

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
      <ParagraphXS weight={700}>{account.name}</ParagraphXS>
      <ParagraphXS className="account-details">...{account.mask}</ParagraphXS>
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
