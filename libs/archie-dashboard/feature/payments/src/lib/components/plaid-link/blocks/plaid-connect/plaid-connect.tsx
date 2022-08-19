import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaidAccount, PlaidLinkOnSuccessMetadata, usePlaidLink } from 'react-plaid-link';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAccessToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-access-token';
import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import plaidLogo from '../../../../../assets/plaid_logo.png';
import { ConnectableAccount } from '../../../interfaces';

import { PlaidConnectStyled } from './plaid-connect.styled';

function transformAccounts(accountsBase: PlaidAccount[]): ConnectableAccount[] {
  const accountsResponse: ConnectableAccount[] = accountsBase.map((account) => ({
    id: account.id,
    name: account.name,
    mask: account.mask,
    type: account.type,
  }));

  return accountsResponse;
}

interface PlaidConnectProps {
  linkToken: string;
  onLinkSuccess: (publicToken: string, availableAccounts: ConnectableAccount[]) => void;
}

export const PlaidConnect: FC<PlaidConnectProps> = ({ linkToken, onLinkSuccess }) => {
  const { t } = useTranslation();
  const createAccessTokenMutation = useCreateAccessToken();

  const onSuccess = (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    onLinkSuccess(publicToken, transformAccounts(metadata.accounts));
  };

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  };

  const { open } = usePlaidLink(config);

  return (
    <PlaidConnectStyled>
      <ButtonPrimary
        isLoading={createAccessTokenMutation.state === RequestState.LOADING}
        disabled={createAccessTokenMutation.state === RequestState.LOADING}
        onClick={() => {
          open();
        }}
      >
        {t('dashboard_payment.plaid_connect.btn_connect')}
      </ButtonPrimary>
      <div className="plaid-logo">
        <img src={plaidLogo} alt="Plaid" />
      </div>
    </PlaidConnectStyled>
  );
};
