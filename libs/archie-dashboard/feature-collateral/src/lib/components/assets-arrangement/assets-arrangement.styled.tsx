import styled from 'styled-components';

import { collateralAssetsColor } from '@archie-webapps/util-constants';

interface AssetsArrangementStyledProps {
  btc: number;
  eth: number;
  sol: number;
  usdc: number;
}

export const AssetsArrangementStyled = styled.div<AssetsArrangementStyledProps>`
  width: 100%;
  margin-bottom: 2rem;

  .range {
    display: block;
    background-image: ${({ theme, btc, eth, sol, usdc }) =>
      `linear-gradient(
          to right, 
          ${collateralAssetsColor.btc} 0 ${btc}%, 
          ${collateralAssetsColor.eth} ${btc}% ${btc + eth}%, 
          ${collateralAssetsColor.sol} ${btc + eth}% ${btc + eth + sol}%,
          ${collateralAssetsColor.usdc} ${btc + eth + sol}% 100%)
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
      background-color: ${collateralAssetsColor.btc};
    }

    &.etc {
      background-color: ${collateralAssetsColor.eth};
    }

    &.sol {
      background-color: ${collateralAssetsColor.sol};
    }

    &.usdc {
      background-color: ${collateralAssetsColor.usdc};
    }
  }
`;
