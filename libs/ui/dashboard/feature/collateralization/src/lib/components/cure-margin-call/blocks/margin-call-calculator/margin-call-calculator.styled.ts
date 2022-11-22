import styled from 'styled-components';

export const MarginCallCalculatorStyled = styled.div`
  width: 100%;
  max-width: 730px;

  .ltv-info {
    margin-bottom: 2.5rem;
  }

  .align-right {
    text-align: right;
  }

  .asset-copy {
    max-width: fit-content;
    cursor: pointer;
  }

  .custom-ltv {
    position: relative;
    max-width: 3.75rem;
    margin: 0;

    :after {
      content: '%';
      position: absolute;
      top: 0.4rem;
      right: 0.5rem;
      line-height: 1;
    }

    input {
      padding-right: 1.25rem;
      margin: 0;
      -moz-appearance: textfield;

      ::-webkit-outer-spin-button,
      ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
`;
