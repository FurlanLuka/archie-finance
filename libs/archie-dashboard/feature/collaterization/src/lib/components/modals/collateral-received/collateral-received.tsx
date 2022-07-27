import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { CollateralReceivedModalStyled } from './collateral-received.styled';

interface CollateralReceivedModalProps {
  onConfirm: () => void;
  collateralText: string;
  creditValue: number;
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({
  onConfirm,
  collateralText,
  creditValue,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <ParagraphM weight={700}>{t('dashboard_collaterization.collateral_received_modal.title')}</ParagraphM>
        <ParagraphXS>
          {t('dashboard_collaterization.collateral_received_modal.text', {
            collateral: collateralText,
            credit_value: creditValue,
          })}
        </ParagraphXS>
        <ButtonPrimary onClick={onConfirm} maxWidth="fit-content">
          {t('dashboard_collaterization.collateral_received_modal.btn')}
        </ButtonPrimary>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
