import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Modal,
  BodyM,
  ButtonPrimary,
  TitleS,
  ButtonOutline,
} from '@archie/ui/shared/design-system';

import { Change2faConfirmationModalStyled } from './change-2fa-confirmation.styled';

interface Change2faConfirmationModalProps {
  isOpen: boolean;
  onConfirm: VoidFunction;
  close: VoidFunction;
}

export const Change2faConfirmationModal: FC<
  Change2faConfirmationModalProps
> = ({ isOpen, onConfirm, close }) => {
  const { t } = useTranslation();

  return (
    <Modal maxWidth="580px" isOpen={isOpen} close={close}>
      <Change2faConfirmationModalStyled>
        <TitleS className="modal-title">{t('change_2fa_modal.title')}</TitleS>
        <BodyM className="modal-text">{t('change_2fa_modal.text')}</BodyM>
        <div className="btn-group">
          <ButtonOutline width="10rem" onClick={close}>
            {t('btn_cancel')}
          </ButtonOutline>
          <ButtonPrimary width="10rem" onClick={onConfirm}>
            {t('btn_yes')}
          </ButtonPrimary>
        </div>
      </Change2faConfirmationModalStyled>
    </Modal>
  );
};
