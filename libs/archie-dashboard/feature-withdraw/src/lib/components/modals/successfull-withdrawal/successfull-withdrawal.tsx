import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, ParagraphM, ParagraphS } from '@archie-webapps/ui-design-system';

import { SuccessfullWithdrawalModalStyled } from './successfull-withdrawal.styled';

interface SuccessfullWithdrawalModalProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const SuccessfullWithdrawalModal: FC<SuccessfullWithdrawalModalProps> = ({ isOpen, close, onConfirm }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <Modal isOpen={isOpen} close={close} maxWidth="730px">
      <SuccessfullWithdrawalModalStyled>
        <ParagraphM weight={800} className="title">
          {t('dashboard_withdraw.successfull_withdrawal_modal.title')}
        </ParagraphM>
        <ParagraphS className="subtitle">
          {t('dashboard_withdraw.successfull_withdrawal_modal.subtitle')}
          <a
            href="/" // TBD
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            {t('dashboard_withdraw.successfull_withdrawal_modal.link')}
          </a>
          .
        </ParagraphS>
        <ButtonPrimary maxWidth="fit-content" onClick={handleConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </SuccessfullWithdrawalModalStyled>
    </Modal>
  );
};
