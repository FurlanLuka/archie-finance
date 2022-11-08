import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useCreateLinkToken } from '@archie/ui/shared/data-access/archie-api/plaid/hooks/use-create-link-token';
import { TitleS, BodyM } from '@archie/ui/shared/design-system';

import { PlaidConnectLoading } from './blocks/plaid-connect-loading/plaid-connect-loading';
import { PlaidConnect } from './blocks/plaid-connect/plaid-connect';
import { PlaidLinkStyled } from './plaid-link.styled';

// TODO 2 layer prop passing isn't optimal, rework if the flow becomes more complex
interface PlaidLinkProps {
  onLinkSuccess: (
    publicToken: string,
    availableAccounts: PaymentInstrument[],
  ) => void;
}

export const PlaidLink: FC<PlaidLinkProps> = ({ onLinkSuccess }) => {
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
      return (
        <PlaidConnect
          onLinkSuccess={onLinkSuccess}
          linkToken={createLinkTokenMutation.data.token}
        />
      );
    }

    return <></>;
  };

  return (
    <PlaidLinkStyled>
      <TitleS className="modal-title">
        {t('dashboard_payment.plaid_connect.title')}
      </TitleS>
      <BodyM className="modal-text">
        {t('dashboard_payment.plaid_connect.text')}
      </BodyM>
      {getContent()}
    </PlaidLinkStyled>
  );
};
