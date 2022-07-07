import { FC } from 'react';

import { ParagraphXS } from '@archie-webapps/ui-design-system';
import { Icon, IconName } from '@archie-webapps/ui-icons';
import { theme } from '@archie-webapps/ui-theme';

import { CollateralCurrencyStyled } from './collateral-currency.styled';

interface CollateralCurrencyProps {
  icon?: IconName;
  name?: string;
  short?: string;
}

export const CollateralCurrency: FC<CollateralCurrencyProps> = ({ icon, name, short }) => (
  <CollateralCurrencyStyled>
    <div className="icon">{icon && <Icon name={icon} />}</div>
    <div className="name">
      <ParagraphXS weight={700}>{name}</ParagraphXS>
      <ParagraphXS weight={500} color={theme.textSecondary}>
        {short}
      </ParagraphXS>
    </div>
  </CollateralCurrencyStyled>
);
