import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlaidLink } from 'react-plaid-link';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAccessToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-access-token';
import { ButtonPrimary, Loader } from '@archie-webapps/shared/ui/design-system';

interface PlaidConnectProps {
  linkToken: string;
  onAccessTokenCreate: (itemId: string) => void;
}

export const PlaidConnect: FC<PlaidConnectProps> = ({ linkToken, onAccessTokenCreate }) => {
  const { t } = useTranslation();
  const createAccessTokenMutation = useCreateAccessToken();

  function onSuccess(publicToken: string) {
    if (createAccessTokenMutation.state === RequestState.IDLE) {
      createAccessTokenMutation.mutate({ publicToken });
    }
  }

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
    <div>
      {createAccessTokenMutation.state === RequestState.LOADING ? (
        <Loader />
      ) : (
        <ButtonPrimary
          onClick={() => {
            open();
          }}
        >
          {t('dashboard_payment.plaid_connect.btn_connect')}
        </ButtonPrimary>
      )}
    </div>
  );
};
