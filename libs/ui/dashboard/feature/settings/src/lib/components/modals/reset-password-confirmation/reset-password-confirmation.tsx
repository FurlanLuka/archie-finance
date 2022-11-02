import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, BodyM, ButtonPrimary, TitleS } from '@archie/ui/shared/design-system';

import { ResetPasswordConfirmationModalStyled } from './reset-password-confirmation.styled';

interface ResetPasswordConfirmationModalProps {
  isOpen: boolean;
  close: VoidFunction;
}

export const ResetPasswordConfirmationModal: FC<ResetPasswordConfirmationModalProps> = ({ isOpen, close }) => {
  const { t } = useTranslation();

  return (
    <Modal maxWidth="580px" isOpen={isOpen} close={close}>
      <ResetPasswordConfirmationModalStyled>
        <TitleS className="modal-title">{t('reset_password_modal.title')}</TitleS>
        <BodyM className="modal-text">{t('reset_password_modal.text')}</BodyM>
        <ButtonPrimary width="10rem" onClick={close}>
          {t('btn_ok')}
        </ButtonPrimary>
      </ResetPasswordConfirmationModalStyled>
    </Modal>
  );
};
