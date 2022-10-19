import { linearGradientDef } from '@nivo/core';
import { ResponsiveStream } from '@nivo/stream';
import { FC } from 'react';

import { LTVStatus, LTVColor } from '@archie/ui/shared/constants';
import { theme } from '@archie/ui/shared/theme';

import { CollateralValueChartStyled } from './collateral-value.styled';

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

export const CollateralValueChart: FC = () => (
  <CollateralValueChartStyled>
    <ResponsiveStream
      data={data}
      keys={['Collateral']}
      enableGridY={false}
      curve="linear"
      offsetType="diverging"
      colors={LTVColor[LTVStatus.GOOD]}
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
  </CollateralValueChartStyled>
);
