import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MIN_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { NotEnoughCollateralStyled } from './not-enough-collateral.styled';

interface NotEnoughCollateralProps {
  creditValue: number;
}

export const NotEnoughCollateral: FC<NotEnoughCollateralProps> = ({ creditValue }) => {
  const { t } = useTranslation();
  return (
    <NotEnoughCollateralStyled>
      <ParagraphXS weight={700}>
        {t('not_enough_collateral_popup.text', {
          creditValue: creditValue.toFixed(2),
          difference: (creditValue - MIN_LINE_OF_CREDIT).toFixed(2),
        })}
      </ParagraphXS>
    </NotEnoughCollateralStyled>
  );
};
