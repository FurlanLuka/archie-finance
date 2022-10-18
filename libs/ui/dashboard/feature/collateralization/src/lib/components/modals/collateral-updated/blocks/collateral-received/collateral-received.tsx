import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, TitleS, BodyM } from '@archie-microservices/ui/shared/ui/design-system';

import imgCollateralReceived from '../../../../../../assets/img-collateral-received.png';

import { CollateralReceivedStyled } from './collateral-received.styled';

interface CollateralReceivedProps {
  onConfirm: () => void;
  creditValue: string;
  collateralValue: string;
}

export const CollateralReceived: FC<CollateralReceivedProps> = ({ onConfirm, creditValue, collateralValue }) => {
  const { t } = useTranslation();

  return (
    <CollateralReceivedStyled>
      <div className="image">
        <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
      </div>
      <div className="content">
        <TitleS className="modal-title">{t('dashboard_collateralization.collateral_received_modal.title')}</TitleS>
        <BodyM className="modal-text">
          {t('dashboard_collateralization.collateral_received_modal.text', {
            collateralValue: collateralValue,
            creditValue: creditValue,
          })}
        </BodyM>
        <ButtonPrimary onClick={onConfirm}>{t('btn_ok')}</ButtonPrimary>
      </div>
    </CollateralReceivedStyled>
  );
};
