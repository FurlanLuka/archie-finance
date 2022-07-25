import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, ButtonPrimary, Modal, ParagraphM } from '@archie-webapps/shared/ui-design-system';

import { RevealCardModalStyled } from './reveal-card.styled';

interface RevealCardModalProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const RevealCardModal: FC<RevealCardModalProps> = ({ isOpen, close, onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <Modal isOpen={isOpen} close={close} maxWidth="400px">
      <RevealCardModalStyled>
        <ParagraphM weight={800}>{t('dashboard.reveal_card_modal')}</ParagraphM>
        <div className="btn-group">
          <ButtonOutline onClick={close}>{t('btn_cancel')}</ButtonOutline>
          <ButtonPrimary onClick={handleConfirm}>{t('btn_yes')}</ButtonPrimary>
        </div>
      </RevealCardModalStyled>
    </Modal>
  );
};
