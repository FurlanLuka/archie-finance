import { FC } from 'react';

import { Icon, IconName } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { BodyM } from '../typography/typography.styled';

import { CollateralCurrencyStyled } from './collateral-currency.styled';

interface CollateralCurrencyProps {
  icon?: IconName;
  name?: string;
  short?: string;
}

export const CollateralCurrency: FC<CollateralCurrencyProps> = ({
  icon,
  name,
  short,
}) => (
  <CollateralCurrencyStyled>
    <div className="icon">{icon && <Icon name={icon} />}</div>
    <div className="name">
      <BodyM weight={700}>{name}</BodyM>
      <BodyM weight={500} color={theme.textSecondary}>
        {short}
      </BodyM>
    </div>
  </CollateralCurrencyStyled>
);
