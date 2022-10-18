import { FC } from 'react';

import { BodyM } from '@archie-microservices/ui/shared/ui/design-system';
import { Icon, IconName } from '@archie-microservices/ui/shared/ui/icons';
import { theme } from '@archie-webapps/shared/ui/theme';

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
