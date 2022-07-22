import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, ParagraphM, ParagraphS } from '@archie-webapps/ui-design-system';

import { SuccessfullWithdrawalModalStyled } from './successfull-withdrawal.styled';

interface SuccessfullWithdrawalModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const SuccessfullWithdrawalModal: FC<SuccessfullWithdrawalModalProps> = ({ isOpen, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} maxWidth="730px">
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
        <ButtonPrimary maxWidth="fit-content" onClick={onConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </SuccessfullWithdrawalModalStyled>
    </Modal>
  );
};
