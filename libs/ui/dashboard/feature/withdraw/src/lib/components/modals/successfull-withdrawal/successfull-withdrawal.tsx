import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonPrimary,
  Modal,
  TitleS,
  BodyL,
} from '@archie-microservices/ui/shared/ui/design-system';

import { SuccessfullWithdrawalModalStyled } from './successfull-withdrawal.styled';

interface SuccessfullWithdrawalModalProps {
  addressLink: string;
  onConfirm: () => void;
}

export const SuccessfullWithdrawalModal: FC<
  SuccessfullWithdrawalModalProps
> = ({ addressLink, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen maxWidth="730px">
      <SuccessfullWithdrawalModalStyled>
        <TitleS className="modal-title">
          {t('dashboard_withdraw.successfull_withdrawal_modal.title')}
        </TitleS>
        <BodyL className="modal-subtitle">
          {t('dashboard_withdraw.successfull_withdrawal_modal.subtitle')}
          <a
            href={addressLink}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            {t('dashboard_withdraw.successfull_withdrawal_modal.link')}
          </a>
          .
        </BodyL>
        <ButtonPrimary onClick={onConfirm}>{t('btn_ok')}</ButtonPrimary>
      </SuccessfullWithdrawalModalStyled>
    </Modal>
  );
};
