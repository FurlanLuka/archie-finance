import { FC } from 'react';

import { Icon } from '@archie/ui/shared/ui/icons';
import { BodyL, BodyS } from '@archie/ui/shared/design-system';

import { OptionsItemStyled } from './options-item.styled';
import { theme } from '@archie/ui/shared/ui/theme';

interface OptionsItemProps {
  title: string;
  subtitle?: string;
  onClick: () => void;
}

export const OptionsItem: FC<OptionsItemProps> = ({
  title,
  subtitle,
  onClick,
}) => {
  return (
    <OptionsItemStyled onClick={onClick}>
      <div className="content">
        <BodyL weight={500} className="item-title">
          {title}
        </BodyL>
        {subtitle && (
          <BodyS
            color={theme.textSecondary}
            weight={500}
            className="item-subtitle"
          >
            {subtitle}
          </BodyS>
        )}
      </div>
      <div className="arrow">
        <Icon name="chevron-right" fill={theme.textSecondary} />
      </div>
    </OptionsItemStyled>
  );
};
