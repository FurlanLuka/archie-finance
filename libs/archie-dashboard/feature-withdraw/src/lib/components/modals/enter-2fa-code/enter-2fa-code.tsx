import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, ParagraphM, ParagraphS } from '@archie-webapps/ui-design-system';

import { Enter2faCodeModalStyled } from './enter-2fa-code.styled';

interface Enter2faCodeModalProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const Enter2faCodeModal: FC<Enter2faCodeModalProps> = ({ isOpen, close, onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <Modal isOpen={isOpen} close={close} maxWidth="730px">
      <Enter2faCodeModalStyled>
        <ParagraphM weight={800} className="title">
          {t('dashboard_withdraw.enter_2fa_code_modal.title')}
        </ParagraphM>
        <ParagraphS className="subtitle">{t('dashboard_withdraw.enter_2fa_code_modal.subtitle')}</ParagraphS>
        <ButtonPrimary maxWidth="fit-content" onClick={handleConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </Enter2faCodeModalStyled>
    </Modal>
  );
};
