import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useSetAutopay } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-set-autopay';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { TitleS, BodyM, SelectOption, Select, ButtonPrimary } from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccountItem } from '../connected-account-item/connected-account-item';
import { ConsentCheckbox } from '../consent-checkbox/consent-checkbox';

import { SetupAutopayStyled } from './setup-autopay.styled';

interface AutopayModalProps {
  accounts: AccountResponse[];
  onSuccess: VoidFunction;
}

export const SetupAutopay: FC<AutopayModalProps> = ({ accounts }) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [consentDocumentId, setConsentDocumentId] = useState<string | null>(null);
  const setAutopayMutation = useSetAutopay();

  const header = selectedAccount ? (
    <ConnectedAccountItem account={selectedAccount} />
  ) : (
    <BodyM weight={500}>{t('autopay_modal.select.empty')}</BodyM>
  );

  const options = useMemo(() => {
    return accounts.map((account) => (
      <SelectOption key={account.id} value={account}>
        <ConnectedAccountItem account={account} />
      </SelectOption>
    ));
  }, [accounts]);

  const canSubmit =
    hasConsent &&
    selectedAccount !== null &&
    consentDocumentId !== null &&
    setAutopayMutation.state === RequestState.IDLE;

  return (
    <SetupAutopayStyled>
      <TitleS className="title">{t('autopay_modal.title')}</TitleS>
      <BodyM weight={600}>Payments are automatically scheduled on each period's due date.</BodyM>
      <BodyM>Payment will be the full statement balance of each period.</BodyM>
      <div className="divider" />
      <BodyM className="select-label" weight={700}>
        {t('autopay_modal.select.label')}
      </BodyM>
      <Select
        id="accounts"
        header={header}
        onChange={(account: AccountResponse) => {
          // if we change, we need to get consent anew
          if (account !== selectedAccount) {
            setHasConsent(false);
            setSelectedAccount(account);
          }
        }}
      >
        {options}
      </Select>
      <div className="consent-check">
        <ConsentCheckbox
          hasConsent={hasConsent}
          onChange={(val) => {
            setHasConsent(val);
          }}
          setDocumentId={(documentId) => {
            setConsentDocumentId(documentId);
          }}
          selectedAccount={selectedAccount}
        />
      </div>
      <ButtonPrimary
        disabled={!canSubmit}
        isLoading={setAutopayMutation.state === RequestState.LOADING}
        onClick={() => {
          if (canSubmit) {
            setAutopayMutation.mutate({
              agreementDocumentId: consentDocumentId,
              paymentInstrumentId: selectedAccount.id,
            });
          }
        }}
      >
        {t('autopay_modal.btn_confirm')}
      </ButtonPrimary>
    </SetupAutopayStyled>
  );
};
