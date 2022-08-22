import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccountItemStyled } from './connected-account-item.styled';

interface ConnectedAccountItemProps {
  account: AccountResponse;
}
export const ConnectedAccountItem: FC<ConnectedAccountItemProps> = ({ account }) => {
  const { t } = useTranslation();

  return (
    <ConnectedAccountItemStyled>
      <div className="circle" />
      <div className="account-info">
        <ParagraphXS weight={700}>{account.name}</ParagraphXS>
        <ParagraphXS className="subtitle">
          {account.name} ...{account.mask}
        </ParagraphXS>
      </div>
      <div className="account-balance">
        {/* Handle currency */}
        <ParagraphXS weight={700}>${account.availableBalance}</ParagraphXS>
        <ParagraphXS className="subtitle">{t('dashboard_payment.account_select.balance_subtext')}</ParagraphXS>
      </div>
    </ConnectedAccountItemStyled>
  );
};
