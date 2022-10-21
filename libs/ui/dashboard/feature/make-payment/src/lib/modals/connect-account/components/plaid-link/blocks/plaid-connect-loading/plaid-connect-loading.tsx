import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary } from '@archie/ui/shared/design-system';

import plaidLogo from '../../../../../../../assets/plaid_logo.png';

import { PlaidConnectStyled } from '../plaid-connect/plaid-connect.styled';

export const PlaidConnectLoading: FC = () => {
  const { t } = useTranslation();

  return (
    <PlaidConnectStyled>
      <ButtonPrimary isLoading={true} isDisabled>
        {t('dashboard_payment.plaid_connect.btn_connect')}
      </ButtonPrimary>
      <div className="plaid-logo">
        <img src={plaidLogo} alt="Plaid" />
      </div>
    </PlaidConnectStyled>
  );
};
