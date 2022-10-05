import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { BodyM } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccountItemStyled } from './connected-account-item.styled';

interface ConnectedAccountItemProps {
  account: AccountResponse;
}

// TODO split this into a simple components library
export const ConnectedAccountItem: FC<ConnectedAccountItemProps> = ({ account }) => {
  const { t } = useTranslation();

  return (
    <ConnectedAccountItemStyled>
      <div className="circle" />
      <div className="account-info">
        <BodyM weight={700}>{account.name}</BodyM>
        <BodyM className="subtitle">
          {account.name} ...{account.mask}
        </BodyM>
      </div>
      <div className="account-balance">
        {/* Handle currency */}
        <BodyM weight={700}>${account.availableBalance}</BodyM>
        <BodyM className="subtitle">{t('payment_modal.select_account.balance_subtext')}</BodyM>
      </div>
    </ConnectedAccountItemStyled>
  );
};
