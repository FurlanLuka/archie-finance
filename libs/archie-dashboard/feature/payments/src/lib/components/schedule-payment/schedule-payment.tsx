import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/interfaces';
import { Select, SelectOption } from '@archie-webapps/shared/ui/design-system';

import { AccountItem } from '../account-item/account-item';

import { SchedulePaymentStyled } from './schedule-payment.styled';

interface SchedulePaymentProps {
  connectedAccounts: AccountResponse[];
}

export const SchedulePayment: FC<SchedulePaymentProps> = ({ connectedAccounts }) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse>(connectedAccounts[0]);

  const handleSelect = (account: AccountResponse) => {
    setSelectedAccount(account);
  };

  const header = <AccountItem account={selectedAccount} />;

  const options = useMemo(() => {
    return connectedAccounts.map((account) => (
      <SelectOption key={account.id} value={account}>
        <AccountItem account={account} />
      </SelectOption>
    ));
  }, [connectedAccounts]);

  return (
    <SchedulePaymentStyled>
      <span className="label">{t('dashboard_payment.schedule_payment.label')}</span>
      <Select id="payment_accounts" header={header} onChange={handleSelect}>
        {options}
      </Select>
    </SchedulePaymentStyled>
  );
};
