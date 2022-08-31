import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonOutline, ButtonPrimary, Modal, TitleS } from '@archie-webapps/shared/ui/design-system';

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
        <TitleS>{t('dashboard_home.reveal_card_modal')}</TitleS>
        <div className="btn-group">
          <ButtonOutline maxWidth="100%" onClick={close}>
            {t('btn_cancel')}
          </ButtonOutline>
          <ButtonPrimary maxWidth="100%" onClick={handleConfirm}>
            {t('btn_yes')}
          </ButtonPrimary>
        </div>
      </RevealCardModalStyled>
    </Modal>
  );
};
