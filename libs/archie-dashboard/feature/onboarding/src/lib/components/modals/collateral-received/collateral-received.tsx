import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateCreditLine } from '@archie-webapps/shared/data-access/archie-api/credit_line/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonPrimary, ButtonOutline, Modal, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

import { CollateralReceivedModalStyled } from './collateral-received.styled';

interface CollateralReceivedModalProps {
  onClose: () => void;
  onConfirm: () => void;
  creditValue: string;
  ledgerValue: string;
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({
  onClose,
  onConfirm,
  creditValue,
  ledgerValue,
}) => {
  const { t } = useTranslation();
  const createCreditLine = useCreateCreditLine();

  const handleConfirm = () => {
    if (createCreditLine.state === RequestState.IDLE) {
      createCreditLine.mutate({});
    }
    onConfirm();
  };

  return (
    <Modal isOpen={true} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <TitleS className="modal-title">{t('collateral_received_modal.title')}</TitleS>
          <BodyM className="modal-text">
            {t('collateral_received_modal.text', {
              collateralValue: ledgerValue,
              creditValue: creditValue,
            })}
          </BodyM>
          <div className="btn-group">
            <ButtonOutline onClick={onClose}>{t('collateral_received_modal.btn')}</ButtonOutline>
            <ButtonPrimary onClick={handleConfirm}>{t('btn_next')}</ButtonPrimary>
          </div>
        </div>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
