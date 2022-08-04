import { FC, useState } from 'react';

import { LinkModal } from '@archie-webapps/archie-dashboard/feature/payments';
import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

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
      {showModal && <LinkModal />}
    </>
  );
};
