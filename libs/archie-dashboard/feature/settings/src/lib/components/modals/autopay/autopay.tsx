import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { ConnectAccountModal } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { Loader, Modal, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import { AutopayModalStyled } from './autopay.styled';

interface AutopayModalProps {
  close: () => void;
}

export const AutopayModal: FC<AutopayModalProps> = ({ close }) => {
  const { t } = useTranslation();

  const getConnectedAccountsResponse = useGetConnectedAccounts();

  if (getConnectedAccountsResponse.state === RequestState.LOADING) {
    return (
      <Modal maxWidth="780px" isOpen close={close}>
        <Loader marginAuto />
      </Modal>
    );
  }

  if (getConnectedAccountsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
  }

  if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
    if (getConnectedAccountsResponse.data.length === 0) {
      return <ConnectAccountModal />;
    }

    return (
      <Modal maxWidth="780px" isOpen close={close}>
        <AutopayModalStyled>
          <TitleS className="title">{t('autopay_modal.title')}</TitleS>
          <BodyM weight={600}>Payments are automatically scheduled on each period's due date.</BodyM>
          <BodyM>Payment will be the full statement balance of each period.</BodyM>
          <div className="divider" />
        </AutopayModalStyled>
      </Modal>
    );
  }

  return <></>;
};
