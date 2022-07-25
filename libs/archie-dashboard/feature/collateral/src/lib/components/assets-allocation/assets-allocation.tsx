import { FC } from 'react';

import { ParagraphXXS } from '@archie-webapps/shared/ui/design-system';

import { AssetsAllocationStyled } from './assets-allocation.styled';

interface AssetsAllocationProps {
  btc: number;
  eth: number;
  sol: number;
  usdc: number;
}

export const AssetsAllocation: FC<AssetsAllocationProps> = ({ btc, eth, sol, usdc }) => (
  <AssetsAllocationStyled btc={btc} eth={eth} sol={sol} usdc={usdc}>
    <div className="range" />
    <div className="legend">
      {btc > 0 && (
        <div className="legend-item">
          <ParagraphXXS weight={700}>Bitcoin</ParagraphXXS>
          <div className="legend-item-border btc" />
        </div>
      )}
      {eth > 0 && (
        <div className="legend-item">
          <ParagraphXXS weight={700}>Ethereum</ParagraphXXS>
          <div className="legend-item-border eth" />
        </div>
      )}
      {sol > 0 && (
        <div className="legend-item">
          <ParagraphXXS weight={700}>Solana</ParagraphXXS>
          <div className="legend-item-border sol" />
        </div>
      )}
      {usdc > 0 && (
        <div className="legend-item">
          <ParagraphXXS weight={700}>USDCoin</ParagraphXXS>
          <div className="legend-item-border usdc" />
        </div>
      )}
    </div>
  </AssetsAllocationStyled>
);
