import { FC, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAutopayDocument } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-create-autopay-document';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import {
  TitleS,
  BodyM,
  SelectOption,
  Select,
  InputRadio,
  BodyL,
  Loader,
} from '@archie-webapps/shared/ui/design-system';

import { ConnectedAccountItem } from '../connected-account-item/connected-account-item';

import { SetupAutopayStyled } from './setup-autopay.styled';

interface AutopayModalProps {
  accounts: AccountResponse[];
  onSuccess: VoidFunction;
}

export const SetupAutopay: FC<AutopayModalProps> = ({ accounts }) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const createAutopayDocumentMutation = useCreateAutopayDocument();

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
    if (selectedAccount !== null && createAutopayDocumentMutation.state === RequestState.IDLE) {
      createAutopayDocumentMutation.mutate({ paymentInstrumentId: selectedAccount.id });
    }
  }, [selectedAccount, createAutopayDocumentMutation]);

  const getConsentCheckbox = () => {
    if (!selectedAccount) {
      return (
        <>
          <input type="checkbox" checked={false} disabled />
          <BodyL className="disabled">
            <Trans components={{ a: <span /> }}>autopay_modal.consent_text</Trans>
          </BodyL>
        </>
      );
    }

    if (createAutopayDocumentMutation.state === RequestState.LOADING) {
      return (
        <>
          <input type="checkbox" checked={false} disabled />
          <BodyL>
            <Trans components={{ a: <span /> }}>autopay_modal.consent_text</Trans>
          </BodyL>
          <Loader />
        </>
      );
    }

    if (createAutopayDocumentMutation.state === RequestState.SUCCESS) {
      return (
        <>
          <input
            type="checkbox"
            checked={hasConsent}
            onChange={(e) => {
              setHasConsent(e.target.checked);
            }}
          />
          <BodyL>
            <Trans
              components={{
                a: <a className="link" href={createAutopayDocumentMutation.data.document} />,
              }}
            >
              autopay_modal.consent_text
            </Trans>
          </BodyL>
        </>
      );
    }

    return (
      <>
        <input type="checkbox" checked={false} disabled />
        <BodyL>
          <Trans components={{ a: <span /> }}>autopay_modal.consent_text</Trans>
        </BodyL>
      </>
    );
  };

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
        onChange={(account: AccountResponse) => setSelectedAccount(account)}
        isDisabled={createAutopayDocumentMutation.state === RequestState.LOADING}
      >
        {options}
      </Select>
      <InputRadio className="consent-check">{getConsentCheckbox()}</InputRadio>
    </SetupAutopayStyled>
  );
};
