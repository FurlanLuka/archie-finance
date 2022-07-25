import styled from 'styled-components';

import { CollateralAssetsColor } from '@archie-webapps/shared/constants';

interface AssetsAllocationStyledProps {
  btc: number;
  eth: number;
  sol: number;
  usdc: number;
}

export const AssetsAllocationStyled = styled.div<AssetsAllocationStyledProps>`
  width: 100%;
  margin-bottom: 2rem;

  .range {
    display: block;
    background-image: ${({ btc, eth, sol, usdc }) =>
      `linear-gradient(
          to right, 
          ${CollateralAssetsColor.BTC} 0 ${btc}%, 
          ${CollateralAssetsColor.ETH} ${btc}% ${btc + eth}%, 
          ${CollateralAssetsColor.SOL} ${btc + eth}% ${btc + eth + sol}%,
          ${CollateralAssetsColor.USDC} ${btc + eth + sol}% 100%)
        `};
    border-radius: 0.25rem;
    width: 100%;
    height: 0.75rem;
    margin-bottom: 1rem;
    appearance: none;
    -webkit-appearance: none;
    outline: none;

    ::-webkit-slider-thumb {
      display: none;
    }

    ::-moz-range-thumb {
      display: none;
    }
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .legend-item {
    position: relative;
    padding-left: 0.5rem;
  }

  .legend-item-border {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border-radius: 2px;
    width: 2px;
    height: 0.75rem;

    &.btc {
      background-color: ${CollateralAssetsColor.BTC};
    }

    &.eth {
      background-color: ${CollateralAssetsColor.ETH};
    }

    &.sol {
      background-color: ${CollateralAssetsColor.SOL};
    }

    &.usdc {
      background-color: ${CollateralAssetsColor.USDC};
    }
  }
`;
