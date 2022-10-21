import styled from 'styled-components';

interface NextPaymentChartStyledProps {
  backgroundSize: string;
}

export const NextPaymentChartStyled = styled.div<NextPaymentChartStyledProps>`
  width: 100%;

  input {
    display: block;
    background-color: ${({ theme }) => theme.nextPaymentDefault};
    background-image: ${({ theme }) =>
      `linear-gradient(${theme.nextPaymentActive}, ${theme.nextPaymentActive})`};
    background-size: ${({ backgroundSize }) => backgroundSize};
    background-repeat: no-repeat;
    border-radius: 0.25rem;
    width: 100%;
    height: 0.25rem;
    margin: 0.25rem 0 0;
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
`;
