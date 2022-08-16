import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateLinkToken } from '@archie-webapps/shared/data-access/archie-api/plaid/hooks/use-create-link-token';
import { ButtonPrimary, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import plaidLogo from '../../../assets/plaid_logo.png';

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

  function getContent() {
    if (createLinkTokenMutation.state === RequestState.ERROR) {
      return <div>Something went wrong :(</div>;
    }

    if (createLinkTokenMutation.state === RequestState.LOADING) {
      return <PlaidConnectLoading />;
    }

    if (createLinkTokenMutation.state === RequestState.SUCCESS) {
      return <PlaidConnect onAccessTokenCreate={onAccessTokenCreate} linkToken={createLinkTokenMutation.data.token} />;
    }

    return <></>;
  }

  return (
    <PlaidLinkStyled>
      <ParagraphM weight={800}>{t('dashboard_payment.plaid_connect.title')}</ParagraphM>
      <ParagraphS className="text">{t('dashboard_payment.plaid_connect.text')}</ParagraphS>
      {getContent()}
    </PlaidLinkStyled>
  );
};
