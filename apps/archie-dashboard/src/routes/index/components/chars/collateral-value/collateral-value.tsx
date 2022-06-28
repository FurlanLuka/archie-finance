import { FC } from 'react';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveStream } from '@nivo/stream';
import { CollateralValueStyled } from './collateral-value.styled';
import { theme } from '@archie-webapps/ui-theme';

const data = [
  {
    Collateral: 5,
  },
  {
    Collateral: 7,
  },
  {
    Collateral: 9,
  },
  {
    Collateral: 5,
  },
  {
    Collateral: 10,
  },
  {
    Collateral: 12,
  },
  {
    Collateral: 4,
  },
  {
    Collateral: 14,
  },
];

export const CollateralValue: FC = () => (
  <CollateralValueStyled>
    <ResponsiveStream
      data={data}
      keys={['Collateral']}
      enableGridY={false}
      curve="linear"
      offsetType="diverging"
      colors={theme.loanToValueActive}
      fillOpacity={0.5}
      borderWidth={2}
      borderColor={theme.collateralValue}
      defs={[
        linearGradientDef('gradient', [
          { offset: 0, color: theme.collateralValue },
          { offset: 20, color: theme.collateralValue },
          { offset: 100, color: theme.backgroundPrimary },
        ]),
      ]}
      fill={[{ match: { id: 'Collateral' }, id: 'gradient' }]}
    />
  </CollateralValueStyled>
);
