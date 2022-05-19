import styled from 'styled-components'

import { InputRangeStyled } from '../../../../../components/_generic/input-range/input-range.styled';

export const CollateralizationStepStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 1rem;
  width: 100%;
  padding: 2.5rem 12% 7rem;
  text-align: center;

  .title {
    margin-bottom: 1rem;
  }

  .subtitle {
    margin-bottom: 3rem;
  }

  ${InputRangeStyled} {
    margin-bottom: 5rem;
  }

  .select {
    position: relative;
    margin-bottom: 8rem;
    width: 100%;
  }

  .select-header {
    display: flex;
    justify-content: flex-start;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.borderHighlight};
    width: 100%;
    padding: 1.25rem 1rem;
    cursor: pointer;
  } 

  .select-list {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: ${({ theme }) => theme.backgroundPrimary};
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
    border-radius: 0.5rem;
    width: 100%;
    margin-top: 0.5rem;
  }

  .select-option {
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
    width: 100%;
    cursor: pointer;

    :last-child {
      border-bottom: 0;
    }
  }

  .result {
    display: flex;
    width: 100%;
    margin-bottom: 3rem;
  }

  .result-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 33.33%;

    p {
      margin-bottom: 0.5rem;
    }
  }

  .info {
    background-color: #F9F9F9;
    border-top: 1px solid ${({ theme }) => theme.borderPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
    height: 25rem;
    width: 100%;
    padding: 1.5rem 1rem;
  }

  .data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 80%;
  }

  .address {
    display: flex;
    width: 100%;
  }

  .address-copy {
    background-color: ${({ theme }) => theme.backgroundPrimary};
    height: 3rem;
    width: 80%;
    padding: 1rem;
    margin-top: 0.25rem;
  }

  .code {
    width: 20%;
  }
`