import { FC } from 'react';

import { Modal } from '@archie-webapps/shared/ui/design-system';

import { PlaidLink } from '../../plaid-link/plaid-link';

export const ConnectAccountModal: FC = () => {
  return (
    <Modal isOpen>
      <PlaidLink />
    </Modal>
  );
};
