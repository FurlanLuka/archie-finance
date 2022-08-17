import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import plaidLogo from '../../../../../assets/plaid_logo.png';

import { PlaidConnectStyled } from './plaid-connect.styled';

export const PlaidConnectLoading: FC = () => {
  const { t } = useTranslation();

  return (
    <PlaidConnectStyled>
      <ButtonPrimary className="connect" isLoading={true} disabled={true}>
        {t('dashboard_payment.plaid_connect.btn_connect')}
      </ButtonPrimary>
      <img src={plaidLogo} alt="Plaid" />
    </PlaidConnectStyled>
  );
};
