import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetConnectedAccounts } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-get-connected-accounts';
import { ButtonPrimary, Loader, Modal, ParagraphM } from '@archie-webapps/shared/ui/design-system';

import { ConnectAccount } from '../connect-account/connect-acount';

import { ConnectedAccount } from './blocks/connected-account';
import { ConnectedAccountsStyled } from './connected-accounts.styled';

export const ConnectedAccounts: FC = () => {
  const { t } = useTranslation();
  const getConnectedAccountsResponse = useGetConnectedAccounts();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  function getContent() {
    if (getConnectedAccountsResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getConnectedAccountsResponse.state === RequestState.ERROR) {
      return <div>Something went wrong :(</div>;
    }

    if (getConnectedAccountsResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('dashboard_payment.connected_accounts.title')}
          </ParagraphM>
          <ButtonPrimary maxWidth="fit-content" onClick={() => setIsAddAccountOpen(true)} className="add-acount">
            {t('dashboard_payment.connected_accounts.btn_add')}
          </ButtonPrimary>
          <div className="account-list">
            {getConnectedAccountsResponse.data.map((account) => (
              <ConnectedAccount key={account.id} account={account} />
            ))}
          </div>
        </>
      );
    }

    return null;
  }

  return (
    <ConnectedAccountsStyled>
      {getContent()}
      {isAddAccountOpen && (
        <Modal isOpen close={() => setIsAddAccountOpen(false)} maxWidth="800px">
          <ConnectAccount onAccountConnect={() => setIsAddAccountOpen(false)} />
        </Modal>
      )}
    </ConnectedAccountsStyled>
  );
};
