import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccounts } from '../../components/connected-accounts/connected-accounts';
import { PaymentFlowModal } from '../../components/modals/payment-flow/payment-flow';

import { PaymentScreenStyled } from './payment.styled';

export const PaymentScreen: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

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
        {t('dashboard_payment.btn_pay')}
      </ButtonPrimary>
      <ConnectedAccounts />
      {showModal && <PaymentFlowModal close={closeModal} />}
    </PaymentScreenStyled>
  );
};
