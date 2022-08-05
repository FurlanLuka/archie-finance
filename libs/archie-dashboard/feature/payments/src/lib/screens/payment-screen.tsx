import { FC, useState } from 'react';

import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import { ConnectAccountModal } from '../components/modals/connect-account/connect-acount-modal';

export const PaymentScreen: FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ButtonPrimary
        onClick={() => {
          setShowModal((show) => !show);
        }}
      >
        Make a payment
      </ButtonPrimary>
      {showModal && <ConnectAccountModal />}
    </>
  );
};
