import { FC, useEffect } from 'react';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateLinkToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-link-token';
import { Loader } from '@archie-webapps/shared/ui/design-system';

import { PlaidConnect } from './blocks/plaid-connect/plaid-connect';

export const PlaidLink: FC = () => {
  const createLinkTokenMutation = useCreateLinkToken();

  useEffect(() => {
    if (createLinkTokenMutation.state === RequestState.IDLE) {
      createLinkTokenMutation.mutate({});
    }
  }, [createLinkTokenMutation]);

  function getContent() {
    if (createLinkTokenMutation.state === RequestState.ERROR) {
      return <div>Something went wrong :(</div>;
    }

    if (createLinkTokenMutation.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (createLinkTokenMutation.state === RequestState.SUCCESS) {
      return <PlaidConnect linkToken={createLinkTokenMutation.data.token} />;
    }

    return <></>;
  }

  return getContent();
};
