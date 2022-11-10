import { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { useCreateAutopayDocument } from '@archie/ui/shared/data-access/archie-api/autopay/hooks/use-create-autopay-document';
import { MutationState } from '@archie/ui/shared/data-access/archie-api/interface';
import {
  Modal,
  InputCheckbox,
  ButtonPrimary,
  BodyL,
} from '@archie/ui/shared/design-system';

import { ConsentCheckStyled } from './consent-check.styled';

interface ConsentCheckProps {
  hasConsent: boolean;
  onChange: (hasConsent: boolean) => void;
  setDocumentId: (documentId: string) => void;
  selectedAccount: PaymentInstrument | null;
}

export const ConsentCheck: FC<ConsentCheckProps> = ({
  hasConsent,
  onChange,
  selectedAccount,
  setDocumentId,
}) => {
  const { t } = useTranslation();
  const createAutopayDocumentMutation = useCreateAutopayDocument();

  const [showDocument, setShowDocument] = useState(false);

  useEffect(() => {
    if (
      selectedAccount !== null &&
      createAutopayDocumentMutation.state === MutationState.IDLE
    ) {
      createAutopayDocumentMutation.mutate({
        paymentInstrumentId: selectedAccount.id,
      });
    }
  }, [selectedAccount, createAutopayDocumentMutation]);

  useEffect(() => {
    if (createAutopayDocumentMutation.state === MutationState.SUCCESS) {
      setDocumentId(createAutopayDocumentMutation.data.id);
    }
  }, [createAutopayDocumentMutation, setDocumentId]);

  const getContent = () => {
    if (!selectedAccount) {
      return (
        <InputCheckbox>
          <input type="checkbox" checked={false} disabled />
          <BodyL>
            <Trans components={{ btn: <span /> }}>
              autopay_modal.consent_text
            </Trans>
          </BodyL>
        </InputCheckbox>
      );
    }

    if (createAutopayDocumentMutation.state === MutationState.LOADING) {
      return (
        <InputCheckbox>
          <input type="checkbox" checked={false} disabled />
          <BodyL>
            <Trans components={{ btn: <span /> }}>
              autopay_modal.consent_text
            </Trans>
          </BodyL>
        </InputCheckbox>
      );
    }

    if (createAutopayDocumentMutation.state === MutationState.SUCCESS) {
      return (
        <>
          <InputCheckbox>
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
                      className="radio-label-btn"
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
          </InputCheckbox>
          {showDocument && (
            <Modal maxWidth="780px" isOpen close={() => setShowDocument(false)}>
              <div
                className="document-inner"
                dangerouslySetInnerHTML={{
                  __html: createAutopayDocumentMutation.data.document,
                }}
              />
              <ButtonPrimary
                width="12rem"
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

    return <></>;
  };

  return <ConsentCheckStyled>{getContent()}</ConsentCheckStyled>;
};
