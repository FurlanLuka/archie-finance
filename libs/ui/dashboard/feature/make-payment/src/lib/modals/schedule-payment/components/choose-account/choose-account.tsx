import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie/ui/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import {
  ButtonPrimary,
  Loader,
  TitleS,
  BodyM,
  Select,
  SelectOption,
} from '@archie/ui/shared/design-system';

import { ConnectedAccountItem } from './blocks/connected-account-item/connected-account-item';
import { ChooseAccountStyled } from './choose-account.styled';

interface ChooseAccountProps {
  onConfirm: (account: PaymentInstrument) => void;
}

export const ChooseAccount: FC<ChooseAccountProps> = ({ onConfirm }) => {
  const { t } = useTranslation();
  const getConnectedAccountsResponse = useGetConnectedAccounts();

  const [selectedAccount, setSelectedAccount] =
    useState<PaymentInstrument | null>(null);

  const handleConfirmClick = () => {
    if (!selectedAccount) {
      return;
    }

    onConfirm(selectedAccount);
  };

  useEffect(() => {
    if (
      getConnectedAccountsResponse.state === RequestState.SUCCESS &&
      getConnectedAccountsResponse.data.length === 1
    ) {
      onConfirm(getConnectedAccountsResponse.data[0]);
    }
  }, [getConnectedAccountsResponse, onConfirm]);

  const header = selectedAccount ? (
    <ConnectedAccountItem account={selectedAccount} />
  ) : (
    <BodyM weight={500}>{t('payment_modal.select_account.empty')}</BodyM>
  );

  const options = useMemo(() => {
    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      return getConnectedAccountsResponse.data.map((account) => (
        <SelectOption key={account.id} value={account}>
          <ConnectedAccountItem account={account} />
        </SelectOption>
      ));
    }
    return [];
  }, [getConnectedAccountsResponse]);

  const getContent = () => {
    if (getConnectedAccountsResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getConnectedAccountsResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <TitleS className="modal-title">
            {t('payment_modal.select_account.label')}
          </TitleS>
          <div className="modal-select">
            <Select
              id="accounts"
              header={header}
              onChange={(account: PaymentInstrument) =>
                setSelectedAccount(account)
              }
            >
              {options}
            </Select>
          </div>
          <ButtonPrimary
            onClick={handleConfirmClick}
            width="fit-content"
            disabled={!selectedAccount}
          >
            {t('payment_modal.select_account.btn_confirm')}
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  };

  return <ChooseAccountStyled>{getContent()}</ChooseAccountStyled>;
};
