import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonGhost, ParagraphS, ParagraphXS } from '@archie-webapps/ui-design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

import { CollateralReceivedAlertStyled } from './collateral-received.styled';

export const CollateralReceivedAlert: FC = () => {
  const { t } = useTranslation();

  const handleClick = () => console.log('clicked');

  return (
    <CollateralReceivedAlertStyled>
      <div className="image">
        <img src={imgCollateralReceived} alt={t('collateral_received_alert.img_alt')} />
      </div>
      <div className="content">
        <ParagraphS weight={700}>{t('collateral_received_alert.title')}</ParagraphS>
        <ParagraphXS>{t('collateral_received_alert.text')}</ParagraphXS>
        <ButtonGhost onClick={handleClick} maxWidth="fit-content">
          {t('btn_next')}
        </ButtonGhost>
      </div>
    </CollateralReceivedAlertStyled>
  );
};
