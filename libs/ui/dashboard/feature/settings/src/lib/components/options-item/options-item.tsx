import { FC } from 'react';

import { BodyL, BodyS } from '@archie/ui/shared/design-system';
import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { OptionsItemStyled } from './options-item.styled';

interface OptionsItemProps {
  title: string;
  subtitle?: string;
  isDisabled?: boolean;
  onClick?: () => void;
}

export const OptionsItem: FC<OptionsItemProps> = ({ title, subtitle, isDisabled, onClick }) => (
  <OptionsItemStyled isDisabled={isDisabled} onClick={onClick}>
    <div className="content">
      <BodyL weight={500} className="item-title">
        {title}
      </BodyL>
      {subtitle && (
        <BodyS color={theme.textSecondary} weight={500} className="item-subtitle">
          {subtitle}
        </BodyS>
      )}
    </div>
    <div className="arrow">
      <Icon name="chevron-right" fill={theme.textSecondary} />
    </div>
  </OptionsItemStyled>
);
