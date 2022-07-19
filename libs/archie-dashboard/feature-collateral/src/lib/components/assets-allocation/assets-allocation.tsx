import { FC } from 'react';

import { ParagraphXXS } from '@archie-webapps/ui-design-system';

import { AssetsAllocationStyled } from './assets-allocation.styled';

export const AssetsAllocation: FC = () => (
  <AssetsAllocationStyled btc={75} eth={13} sol={10} usdc={2}>
    <div className="range" />
    <div className="legend">
      <div className="legend-item">
        <ParagraphXXS weight={700}>Bitcoin</ParagraphXXS>
        <div className="legend-item-border btc" />
      </div>
      <div className="legend-item">
        <ParagraphXXS weight={700}>Ethereum</ParagraphXXS>
        <div className="legend-item-border eth" />
      </div>
      <div className="legend-item">
        <ParagraphXXS weight={700}>Solana</ParagraphXXS>
        <div className="legend-item-border sol" />
      </div>
      <div className="legend-item">
        <ParagraphXXS weight={700}>USDCoin</ParagraphXXS>
        <div className="legend-item-border usdc" />
      </div>
    </div>
  </AssetsAllocationStyled>
);
