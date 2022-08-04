import { FC } from 'react';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetLinkToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-link-token';
import { ButtonPrimary, Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { PlaidConnect } from '../../plaid-connect/plaid-connect';

export const LinkModal: FC = () => {
  const getLinkTokenResponse = useGetLinkToken();

  function getContent() {
    if (getLinkTokenResponse.state === RequestState.ERROR) {
      return <div>Something went wrong :(</div>;
    }

    if (getLinkTokenResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getLinkTokenResponse.state === RequestState.SUCCESS) {
      return <PlaidConnect linkToken={getLinkTokenResponse.data.token} />;
    }

    return <></>;
  }
  return <Modal isOpen>{getContent()}</Modal>;
};
