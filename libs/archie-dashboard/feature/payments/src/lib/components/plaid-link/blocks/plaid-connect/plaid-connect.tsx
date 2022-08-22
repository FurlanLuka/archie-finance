import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlaidLink } from 'react-plaid-link';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAccessToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-access-token';
import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import plaidLogo from '../../../../../assets/plaid_logo.png';

import { PlaidConnectStyled } from './plaid-connect.styled';

interface PlaidConnectProps {
  linkToken: string;
  onAccessTokenCreate: (itemId: string) => void;
}

export const PlaidConnect: FC<PlaidConnectProps> = ({ linkToken, onAccessTokenCreate }) => {
  const { t } = useTranslation();
  const createAccessTokenMutation = useCreateAccessToken();

  const onSuccess = (publicToken: string) => {
    if (createAccessTokenMutation.state === RequestState.IDLE) {
      createAccessTokenMutation.mutate({ publicToken });
    }
  };

  useEffect(() => {
    if (createAccessTokenMutation.state === RequestState.SUCCESS) {
      onAccessTokenCreate(createAccessTokenMutation.data.itemId);
    }
  }, [createAccessTokenMutation, onAccessTokenCreate]);

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
