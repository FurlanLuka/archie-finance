import { FC, useState } from 'react';

import { ButtonPrimary, ParagraphM } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccounts } from '../../components/connected-accounts/connected-accounts';
import { PaymentFlowModal } from '../../components/modals/payment-flow/payment-flow';

import { PaymentScreenStyled } from './payment.styled';

export const PaymentScreen: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <PaymentScreenStyled>
      <ButtonPrimary
        className="payment"
        onClick={() => {
          setShowModal((show) => !show);
        }}
      >
        Pay now!
      </ButtonPrimary>
      <ConnectedAccounts />
      {showModal && <PaymentFlowModal close={closeModal} />}
    </PaymentScreenStyled>
  );
};
