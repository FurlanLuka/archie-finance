import { FC } from 'react';

import { BodyS } from '@archie-webapps/shared/ui/design-system';

import { AssetsAllocationStyled } from './assets-allocation.styled';

interface AssetsAllocationProps {
  btc?: number;
  eth?: number;
  sol?: number;
  usdc?: number;
}

export const AssetsAllocation: FC<AssetsAllocationProps> = ({
  btc = 0,
  eth = 0,
  sol = 0,
  usdc = 0,
}) => (
  <AssetsAllocationStyled btc={btc} eth={eth} sol={sol} usdc={usdc}>
    <div className="range" />
    <div className="legend">
      {btc > 0 && (
        <div className="legend-item">
          <BodyS weight={700}>Bitcoin</BodyS>
          <div className="legend-item-border btc" />
        </div>
      )}
      {eth > 0 && (
        <div className="legend-item">
          <BodyS weight={700}>Ethereum</BodyS>
          <div className="legend-item-border eth" />
        </div>
      )}
      {sol > 0 && (
        <div className="legend-item">
          <BodyS weight={700}>Solana</BodyS>
          <div className="legend-item-border sol" />
        </div>
      )}
      {usdc > 0 && (
        <div className="legend-item">
          <BodyS weight={700}>USDCoin</BodyS>
          <div className="legend-item-border usdc" />
        </div>
      )}
    </div>
  </AssetsAllocationStyled>
);
