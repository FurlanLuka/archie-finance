import { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateAutopayDocument } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-create-autopay-document';
import { AccountResponse } from '@archie-webapps/shared/data-access/archie-api/plaid/api/get-connected-accounts';
import { BodyL, ButtonPrimary, Loader, Modal } from '@archie-webapps/shared/ui/design-system';

import { ConsentCheckboxStyled } from './consent-checkbox.styled';

interface ConsentCheckboxProps {
  hasConsent: boolean;
  onChange: (hasConsent: boolean) => void;
  setDocumentId: (documentId: string) => void;
  selectedAccount: AccountResponse | null;
}

export const ConsentCheckbox: FC<ConsentCheckboxProps> = ({ hasConsent, onChange, selectedAccount, setDocumentId }) => {
  const { t } = useTranslation();
  const [showDocument, setShowDocument] = useState(false);
  const createAutopayDocumentMutation = useCreateAutopayDocument();

  useEffect(() => {
    if (selectedAccount !== null && createAutopayDocumentMutation.state === RequestState.IDLE) {
      createAutopayDocumentMutation.mutate({ paymentInstrumentId: selectedAccount.id });
    }
  }, [selectedAccount, createAutopayDocumentMutation]);

  useEffect(() => {
    if (createAutopayDocumentMutation.state === RequestState.SUCCESS) {
      setDocumentId(createAutopayDocumentMutation.data.id);
    }
  }, [createAutopayDocumentMutation, setDocumentId]);

  const getContent = () => {
    if (!selectedAccount) {
      return (
        <ConsentCheckboxStyled>
          <input type="checkbox" checked={false} disabled />
          <BodyL className="disabled">
            <Trans components={{ btn: <span /> }}>autopay_modal.consent_text</Trans>
          </BodyL>
        </ConsentCheckboxStyled>
      );
    }

    if (createAutopayDocumentMutation.state === RequestState.LOADING) {
      return (
        <ConsentCheckboxStyled>
          <input type="checkbox" checked={false} disabled />
          <BodyL>
            <Trans components={{ btn: <span /> }}>autopay_modal.consent_text</Trans>
          </BodyL>
          <Loader />
        </ConsentCheckboxStyled>
      );
    }

    if (createAutopayDocumentMutation.state === RequestState.SUCCESS) {
      return (
        <>
          <ConsentCheckboxStyled>
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
                  btn: (
                    <button
                      className="document-btn"
                      onClick={() => {
                        setShowDocument(true);
                      }}
                    />
                  ),
                }}
              >
                autopay_modal.consent_text
              </Trans>
            </BodyL>
          </ConsentCheckboxStyled>
          {showDocument && (
            <Modal
              isOpen
              close={() => {
                setShowDocument(false);
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: createAutopayDocumentMutation.data.document,
                }}
              />
              <ButtonPrimary
                onClick={() => {
                  setShowDocument(false);
                  onChange(true);
                }}
              >
                {t('autopay_modal.document_agree')}
              </ButtonPrimary>
            </Modal>
          )}
        </>
      );
    }

    return (
      <ConsentCheckboxStyled>
        <input type="checkbox" checked={false} disabled />
        <BodyL>
          <Trans components={{ btn: <span /> }}>autopay_modal.consent_text</Trans>
        </BodyL>
      </ConsentCheckboxStyled>
    );
  };

  return getContent();
};
