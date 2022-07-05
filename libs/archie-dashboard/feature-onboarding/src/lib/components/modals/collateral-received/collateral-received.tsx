import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, ParagraphM, ParagraphXS } from '@archie-webapps/ui-design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

import { CollateralReceivedModalStyled } from './collateral-received.styled';

interface CollateralReceivedModalProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({ isOpen, close, onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <Modal isOpen={isOpen} close={close} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <ParagraphM weight={700}>{t('collateral_received_modal.title')}</ParagraphM>
          <ParagraphXS>{t('collateral_received_modal.text')}</ParagraphXS>
          <ButtonPrimary onClick={handleConfirm} maxWidth="10rem">
            {t('btn_next')}
          </ButtonPrimary>
        </div>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
