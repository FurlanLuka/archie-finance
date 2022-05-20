import { FC, ReactElement } from 'react';
import { CollateralCurencyStyled } from './collateral-curency.styled';
import { ParagraphXS } from '../_generic/typography/typography.styled';

interface CollateralCurencyProps {
  icon?: ReactElement;
  name?: string;
  short?: string;
}

export const CollateralCurency: FC<CollateralCurencyProps> = ({ icon, name, short }) => (
  <CollateralCurencyStyled>
    <div className="icon">{icon}</div>
    <div className="name">
      <ParagraphXS weight={700}>{name}</ParagraphXS>
      <ParagraphXS>{short}</ParagraphXS>
    </div>
  </CollateralCurencyStyled>
);
