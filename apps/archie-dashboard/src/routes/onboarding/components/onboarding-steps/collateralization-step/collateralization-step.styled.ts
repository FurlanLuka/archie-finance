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
  max-width: 928px;
  padding: 2.5rem 7% 3.5rem;
  text-align: center;

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    margin-bottom: 3.5rem;
  }

  .inputs {
    display: flex;
    gap: 2rem;
    width: 100%;
    margin-bottom: 4rem;
  }

  .select {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .select-header {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.borderHighlight};
    height: 3rem;
    width: 100%;
    padding: 0 1rem;
    margin-top: 0.75rem;
    cursor: pointer;
  } 

  .select-header-caret {
    position: absolute;
    right: 0.75rem;
    transform: rotate(0);
    transition: transform 0.3s linear;

    &.open {
      transform: rotate(180deg);
    }
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
    margin-top: 5.5rem;
    z-index: 1;
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
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .result-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 33.33%;
    max-width: 10rem;

    p {
      margin-bottom: 0.5rem;
    }
  }

  .info {
    background-color: #F9F9F9;
    border-top: 1px solid ${({ theme }) => theme.borderPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
    width: 100%;
    padding: 1.5rem 1rem;
  }

  .address {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 80%;
  }

  .address-copy {
    position: relative;
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.backgroundPrimary};
    border-radius: 0.25rem;
    height: 3rem;
    width: 70%;
    padding: 1rem;
    margin: 0.5rem 0 1.5rem;
  }

  .btn-copy {
    position: absolute;
    right: 1rem;
    top: 0.75rem;
    background-color: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  .info-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .code { 
    width: 12rem;
  }

  .divider {
    height: 1px;
  	width: 100%;
    background-color: ${({ theme }) => theme.borderPrimary};
    border: 0;
    margin: 1rem 0 1.5rem;
  } 

  .info-link {
    display: flex;
  }

  .info-link-url {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.textHighlight};
    margin-left: 0.25rem;
    margin-top: 0.05rem;
  }

  .info-link-icon {
    margin-left: 0.25rem;
  }

  .terms {
    display: flex;
  }

  .terms-title {
    display: flex;
    justify-content: flex-start;
    width: 30%;
  }

  .terms-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 70%;
    margin: 0;
  }

  .terms-list-item {
    margin-bottom: 1rem;
    text-align: left;
  }
`