import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, ButtonOutline, Modal, ParagraphM, ParagraphXS } from '@archie-webapps/ui-design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

import { CollateralReceivedModalStyled } from './collateral-received.styled';

interface CollateralReceivedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} close={onClose} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <ParagraphM weight={700}>{t('collateral_received_modal.title')}</ParagraphM>
          <ParagraphXS>{t('collateral_received_modal.text')}</ParagraphXS>
          <div className="btn-group">
            <ButtonPrimary onClick={handleConfirm} maxWidth="fit-content">
              {t('collateral_received_modal.btn')}
            </ButtonPrimary>
            <ButtonOutline onClick={handleConfirm} maxWidth="fit-content">
              {t('btn_next')}
            </ButtonOutline>
          </div>
        </div>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
