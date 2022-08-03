import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MIN_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { NotEnoughCollateralStyled } from './not-enough-collateral.styled';

interface NotEnoughCollateralProps {
  collateralText: string;
  creditValue: number;
}

export const NotEnoughCollateral: FC<NotEnoughCollateralProps> = ({ collateralText, creditValue }) => {
  const { t } = useTranslation();
  return (
    <NotEnoughCollateralStyled>
      <ParagraphXS>
        {t('not_enough_collateral_popup.text', {
          collateral: collateralText,
          credit_value: creditValue,
          min_value: MIN_LINE_OF_CREDIT,
          difference: MIN_LINE_OF_CREDIT - creditValue,
        })}
      </ParagraphXS>
    </NotEnoughCollateralStyled>
  );
};
