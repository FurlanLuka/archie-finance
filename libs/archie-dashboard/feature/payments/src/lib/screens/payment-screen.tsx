import { FC, useState } from 'react';

import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import { PaymentFlowModal } from '../components/modals/payment-flow/payment-flow';

export const PaymentScreen: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <ButtonPrimary
        onClick={() => {
          setShowModal((show) => !show);
        }}
      >
        Make a payment
      </ButtonPrimary>
      {showModal && <PaymentFlowModal close={closeModal} />}
    </>
  );
};
