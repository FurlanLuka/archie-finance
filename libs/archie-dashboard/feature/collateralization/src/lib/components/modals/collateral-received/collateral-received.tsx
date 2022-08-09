import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

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
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <ParagraphM weight={700}>{t('dashboard_collateralization.collateral_received_modal.title')}</ParagraphM>
          <ParagraphXS>
            {t('dashboard_collateralization.collateral_received_modal.text', {
              collateral: collateralText,
              credit_value: creditValue.toFixed(2),
            })}
          </ParagraphXS>
          <ButtonPrimary onClick={onConfirm} maxWidth="fit-content">
            {t('dashboard_collateralization.collateral_received_modal.btn')}
          </ButtonPrimary>
        </div>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
