import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, Modal, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

import { CollateralReceivedModalStyled } from './collateral-received.styled';

interface CollateralReceivedModalProps {
  onConfirm: () => void;
  creditValue: number;
  collateralValue: number;
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({
  onConfirm,
  creditValue,
  collateralValue,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <TitleS>{t('dashboard_collateralization.collateral_received_modal.title')}</TitleS>
          <BodyM>
            {t('dashboard_collateralization.collateral_received_modal.text', {
              collateralValue: collateralValue.toFixed(2),
              creditValue: creditValue.toFixed(2),
            })}
          </BodyM>
          <ButtonPrimary onClick={onConfirm}>{t('btn_ok')}</ButtonPrimary>
        </div>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
