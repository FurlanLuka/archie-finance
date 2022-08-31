import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useConnectAccount } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-connect-account';
import { ButtonPrimary, Select, SelectOption, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import { ConnectableAccount } from '../../../interfaces';
import { ConnectableAccountItem } from '../connectable-account-item/connectable-account-item';

import { ConnectableAccountSelectStyled } from './connectable-account-select.styled';

interface ConnectableAccountSelectProps {
  accounts: ConnectableAccount[];
  onConnect?: VoidFunction;
  publicToken: string;
}

export const ConnectableAccountSelect: FC<ConnectableAccountSelectProps> = ({ accounts, onConnect, publicToken }) => {
  const { t } = useTranslation();
  const connectAccountMutation = useConnectAccount();

  const [selectedAccount, setSelectedAccount] = useState<ConnectableAccount | null>(null);

  useEffect(() => {
    if (connectAccountMutation.state === RequestState.SUCCESS) {
      onConnect?.();
    }
  }, [connectAccountMutation, onConnect]);

  const handleConfirmClick = () => {
    if (!selectedAccount) {
      return;
    }

    if (connectAccountMutation.state === RequestState.IDLE) {
      connectAccountMutation.mutate({
        publicToken,
        accountId: selectedAccount.id,
      });
    }
  };

  const header = selectedAccount ? (
    <ConnectableAccountItem account={selectedAccount} />
  ) : (
    <BodyM weight={700}>{t('dashboard_payment.account_select.empty')}</BodyM>
  );

  const options = useMemo(() => {
    return accounts.map((account) => (
      <SelectOption key={account.id} value={account}>
        <ConnectableAccountItem account={account} />
      </SelectOption>
    ));
  }, [accounts]);

  return (
    <ConnectableAccountSelectStyled>
      <TitleS className="modal-title">{t('dashboard_payment.account_select.label')}</TitleS>
      <div className="modal-select">
        <Select id="accounts" header={header} onChange={(account: ConnectableAccount) => setSelectedAccount(account)}>
          {options}
        </Select>
      </div>
      <ButtonPrimary
        onClick={handleConfirmClick}
        disabled={!selectedAccount}
        isLoading={connectAccountMutation.state === RequestState.LOADING}
      >
        {t('dashboard_payment.account_select.btn_connect')}
      </ButtonPrimary>
    </ConnectableAccountSelectStyled>
  );
};
