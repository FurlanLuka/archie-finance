import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { ConnectedAccountItem } from '@archie/ui/dashboard/components';
import { useSetAutopay } from '@archie/ui/shared/data-access/archie-api/autopay/hooks/use-set-autopay';
import { MutationState } from '@archie/ui/shared/data-access/archie-api/interface';
import {
  TitleS,
  BodyM,
  SelectOption,
  Select,
  ButtonPrimary,
} from '@archie/ui/shared/design-system';

import { ConsentCheck } from '../consent-check/consent-check';

import { SetupAutopayStyled } from './setup-autopay.styled';

interface AutopayModalProps {
  accounts: PaymentInstrument[];
  onSuccess: VoidFunction;
}

export const SetupAutopay: FC<AutopayModalProps> = ({
  accounts,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const setAutopayMutation = useSetAutopay();

  const [selectedAccount, setSelectedAccount] =
    useState<PaymentInstrument | null>(null);
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [consentDocumentId, setConsentDocumentId] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    if (setAutopayMutation.state === MutationState.SUCCESS) {
      onSuccess();
    }
  }, [onSuccess, setAutopayMutation.state]);

  const canSubmit =
    hasConsent &&
    selectedAccount !== null &&
    consentDocumentId !== null &&
    setAutopayMutation.state === MutationState.IDLE;

  return (
    <SetupAutopayStyled>
      <TitleS className="title">{t('autopay_modal.title')}</TitleS>
      <BodyM weight={600}>{t('autopay_modal.schedule_text')}</BodyM>
      <BodyM>{t('autopay_modal.balance_text')}</BodyM>
      <div className="divider" />
      <BodyM className="select-label" weight={700}>
        {t('autopay_modal.select.label')}
      </BodyM>
      <Select
        id="accounts"
        header={header}
        onChange={(account: PaymentInstrument) => {
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
        <ConsentCheck
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
        width="16rem"
        isDisabled={!canSubmit}
        isLoading={setAutopayMutation.state === MutationState.LOADING}
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
