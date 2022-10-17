import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaidLinkOnSuccessMetadata, usePlaidLink } from 'react-plaid-link';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import plaidLogo from '../../../../../../../assets/plaid_logo.png';
import { transformAccounts } from './plaid-connect.helpers';
import { PlaidConnectStyled } from './plaid-connect.styled';

interface PlaidConnectProps {
  linkToken: string;
  onLinkSuccess: (publicToken: string, availableAccounts: AccountResponse[]) => void;
}

export const PlaidConnect: FC<PlaidConnectProps> = ({ linkToken, onLinkSuccess }) => {
  const { t } = useTranslation();

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
