import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { MutationState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useDisconnectAccount } from '@archie/ui/shared/data-access/archie-api/plaid/hooks/use-disconnect-account';
import { ButtonOutline, BodyM } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { ConnectedAccountStyled } from './connected-account.styled';

interface ConnectedAccountProps {
  account: PaymentInstrument;
}

export const ConnectedAccount: FC<ConnectedAccountProps> = ({ account }) => {
  const { t } = useTranslation();
  const disconnectAccountMutation = useDisconnectAccount(account.id);

  const handleRemoveClick = () => {
    if (disconnectAccountMutation.state === MutationState.IDLE) {
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
        isLoading={disconnectAccountMutation.state === MutationState.LOADING}
      >
        {t('dashboard_payment.connected_accounts.btn_disconnect')}
      </ButtonOutline>
    </ConnectedAccountStyled>
  );
};
