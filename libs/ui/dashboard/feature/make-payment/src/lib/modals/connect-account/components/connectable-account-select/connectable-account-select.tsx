import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { MutationState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useConnectAccount } from '@archie/ui/shared/data-access/archie-api/plaid/hooks/use-connect-account';
import {
  ButtonPrimary,
  Select,
  SelectOption,
  TitleS,
  BodyM,
} from '@archie/ui/shared/design-system';

import { ConnectedAccountItem } from './blocks/connected-account-item/connected-account-item';
import { ConnectableAccountSelectStyled } from './connectable-account-select.styled';

interface ConnectableAccountSelectProps {
  accounts: PaymentInstrument[];
  onConnect?: VoidFunction;
  publicToken: string;
}

export const ConnectableAccountSelect: FC<ConnectableAccountSelectProps> = ({
  accounts,
  onConnect,
  publicToken,
}) => {
  const { t } = useTranslation();
  const connectAccountMutation = useConnectAccount();

  const [selectedAccount, setSelectedAccount] =
    useState<PaymentInstrument | null>(null);

  useEffect(() => {
    if (connectAccountMutation.state === MutationState.SUCCESS) {
      onConnect?.();
    }
  }, [connectAccountMutation, onConnect]);

  const handleConfirmClick = () => {
    if (!selectedAccount) {
      return;
    }

    if (connectAccountMutation.state === MutationState.IDLE) {
      connectAccountMutation.mutate({
        publicToken,
        accountId: selectedAccount.id,
      });
    }
  };

  const header = selectedAccount ? (
    <ConnectedAccountItem account={selectedAccount} />
  ) : (
    <BodyM weight={500}>{t('dashboard_payment.account_select.empty')}</BodyM>
  );

  const options = useMemo(() => {
    return accounts.map((account) => (
      <SelectOption key={account.id} value={account}>
        <ConnectedAccountItem account={account} />
      </SelectOption>
    ));
  }, [accounts]);

  return (
    <ConnectableAccountSelectStyled>
      <TitleS className="modal-title">
        {t('dashboard_payment.account_select.label')}
      </TitleS>
      <div className="modal-select">
        <Select
          id="accounts"
          header={header}
          onChange={(account: PaymentInstrument) => setSelectedAccount(account)}
        >
          {options}
        </Select>
      </div>
      <ButtonPrimary
        onClick={handleConfirmClick}
        disabled={!selectedAccount}
        isLoading={connectAccountMutation.state === MutationState.LOADING}
      >
        {t('dashboard_payment.account_select.btn_connect')}
      </ButtonPrimary>
    </ConnectableAccountSelectStyled>
  );
};
