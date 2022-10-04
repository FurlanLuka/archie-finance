import { FC, useEffect } from 'react';
import { Trans } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAutopayDocument } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-create-autopay-document';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { BodyL, Loader } from '@archie-webapps/shared/ui/design-system';

import { ConsentCheckboxStyled } from './consent-checkbox.styled';

interface ConsentCheckboxProps {
  hasConsent: boolean;
  onChange: (hasConsent: boolean) => void;
  selectedAccount: AccountResponse | null;
}

export const ConsentCheckbox: FC<ConsentCheckboxProps> = ({ hasConsent, onChange, selectedAccount }) => {
  const createAutopayDocumentMutation = useCreateAutopayDocument();

  useEffect(() => {
    if (selectedAccount !== null && createAutopayDocumentMutation.state === RequestState.IDLE) {
      createAutopayDocumentMutation.mutate({ paymentInstrumentId: selectedAccount.id });
    }
  }, [selectedAccount, createAutopayDocumentMutation]);

  const getContent = () => {
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
              onChange(e.target.checked);
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

  return <ConsentCheckboxStyled>{getContent()}</ConsentCheckboxStyled>;
};
