import styled from 'styled-components';

interface InputRangeStyledProps {
  backgroundSize: string;
}

export const InputRangeStyled = styled.label<InputRangeStyledProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  letter-spacing: 0.02em;
  width: 100%;

  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.75rem;
  }

  p {
    margin: 0;
    padding: 0;
  }

  input {
    background-color: ${({ theme }) => theme.inputRange};
    background-image: ${({ theme }) =>
      `linear-gradient(${theme.inputRangeFilled}, ${theme.inputRangeFilled})`};
    background-size: ${({ backgroundSize }) => backgroundSize};
    background-repeat: no-repeat;
    border-radius: 0.25rem;
    width: 100%;
    height: 0.25rem;
    appearance: none;
    -webkit-appearance: none;
    outline: none;

    ::-webkit-slider-thumb {
      width: 1.5rem;
      height: 1.5rem;
      background-color: ${({ theme }) => theme.inputRangeFilled};
      border: 0;
      border-radius: 100%;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
    }

    ::-moz-range-thumb {
      width: 1.5rem;
      height: 1.5rem;
      background-color: ${({ theme }) => theme.inputRangeFilled};
      border: 0;
      border-radius: 100%;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
    }
  }
`;
