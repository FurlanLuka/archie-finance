import { FC } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAccessToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-access-token';
import { ButtonPrimary, Loader } from '@archie-webapps/shared/ui/design-system';

interface PlaidConnectProps {
  linkToken: string;
}

export const PlaidConnect: FC<PlaidConnectProps> = ({ linkToken }) => {
  const createAccessTokenMutation = useCreateAccessToken();

  function onSuccess(publicToken: string) {
    if (createAccessTokenMutation.state === RequestState.IDLE) {
      createAccessTokenMutation.mutate({ publicToken });
    }
  }

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  };
  console.log('tjoken!!!', linkToken);

  const { open, ready } = usePlaidLink(config);

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
          Connect with Plaid
        </ButtonPrimary>
      )}
    </div>
  );
};
