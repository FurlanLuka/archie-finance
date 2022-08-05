import { FC } from 'react';
import { usePlaidLink } from 'react-plaid-link';

import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

interface PlaidConnectProps {
  linkToken: string;
}

export const PlaidConnect: FC<PlaidConnectProps> = ({ linkToken }) => {
  function onSuccess(publicToken: string) {
    console.log('gotsa da token boss', publicToken);
  }
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div>
      <ButtonPrimary
        onClick={() => {
          open();
        }}
      >
        Connect with Plaid
      </ButtonPrimary>
    </div>
  );
};
