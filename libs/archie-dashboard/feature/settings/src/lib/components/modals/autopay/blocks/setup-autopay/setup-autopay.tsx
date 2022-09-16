import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import { ConnectableAccount } from '../../autopay.interfaces';
import { SetupAutopayStyled } from './setup-autopay.styled';

interface AutopayModalProps {
  accounts: ConnectableAccount[];
  onConnect?: VoidFunction;
  publicToken: string;
}

export const SetupAutopay: FC<AutopayModalProps> = () => {
  const { t } = useTranslation();

  // const header = selectedAccount ? (
  //   <ConnectableAccountItem account={selectedAccount} />
  // ) : (
  //   <BodyM weight={500}>{t('dashboard_payment.account_select.empty')}</BodyM>
  // );

  // const options = useMemo(() => {
  //   return accounts.map((account) => (
  //     <SelectOption key={account.id} value={account}>
  //       <ConnectableAccountItem account={account} />
  //     </SelectOption>
  //   ));
  // }, [accounts]);

  return (
    <SetupAutopayStyled>
      <TitleS className="title">{t('autopay_modal.title')}</TitleS>
      <BodyM weight={600}>Payments are automatically scheduled on each period's due date.</BodyM>
      <BodyM>Payment will be the full statement balance of each period.</BodyM>
      <div className="divider" />
    </SetupAutopayStyled>
  );
};
