import styled from 'styled-components';

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
          ${theme.backgroundWarning} 0 ${btc}%, 
          ${theme.backgroundAlert} ${btc}% ${btc + eth}%, 
          ${theme.backgroundSuccess} ${btc + eth}% ${btc + eth + sol}%,
          ${theme.backgroundPositive} ${btc + eth + sol}% 100%)
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
    background-color: ${({ theme }) => theme.backgroundWarning};
    border-radius: 2px;
    width: 2px;
    height: 0.75rem;
  }
`;
