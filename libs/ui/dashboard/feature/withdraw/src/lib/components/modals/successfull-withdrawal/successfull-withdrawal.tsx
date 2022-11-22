import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Link,
  ButtonPrimary,
  Modal,
  TitleS,
  BodyL,
} from '@archie/ui/shared/design-system';
import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

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
          <Link href={addressLink} target="_blank" rel="noreferrer">
            {t('dashboard_withdraw.successfull_withdrawal_modal.link')}
            <Icon name="external-link" fill={theme.textHighlight} />
          </Link>
        </BodyL>
        <ButtonPrimary width="10rem" onClick={onConfirm}>
          {t('btn_ok')}
        </ButtonPrimary>
      </SuccessfullWithdrawalModalStyled>
    </Modal>
  );
};
