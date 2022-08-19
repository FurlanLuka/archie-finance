import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateLinkToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-link-token';
import { ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { PlaidConnect } from './blocks/plaid-connect/plaid-connect';
import { PlaidConnectLoading } from './blocks/plaid-connect/plaid-connect.loading';
import { PlaidLinkStyled } from './plaid-link.styled';

// TODO 2 layer prop passing isn't optimal, rework if the flow becomes more complex
interface PlaidLinkProps {
  onAccessTokenCreate: (itemId: string) => void;
}

export const PlaidLink: FC<PlaidLinkProps> = ({ onAccessTokenCreate }) => {
  const { t } = useTranslation();
  const createLinkTokenMutation = useCreateLinkToken();

  useEffect(() => {
    if (createLinkTokenMutation.state === RequestState.IDLE) {
      createLinkTokenMutation.mutate({});
    }
  }, [createLinkTokenMutation]);

  const getContent = () => {
    if (createLinkTokenMutation.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (createLinkTokenMutation.state === RequestState.LOADING) {
      return <PlaidConnectLoading />;
    }

    if (createLinkTokenMutation.state === RequestState.SUCCESS) {
      return <PlaidConnect onAccessTokenCreate={onAccessTokenCreate} linkToken={createLinkTokenMutation.data.token} />;
    }

    return <></>;
  };

  return (
    <PlaidLinkStyled>
      <ParagraphM weight={800} className="modal-title">
        {t('dashboard_payment.plaid_connect.title')}
      </ParagraphM>
      <ParagraphXS className="modal-text">{t('dashboard_payment.plaid_connect.text')}</ParagraphXS>
      {getContent()}
    </PlaidLinkStyled>
  );
};
