import styled from 'styled-components'

import breakpoints from '../../../constants/breakpoints';

export const InputSelectStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

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

    @media (max-width: ${breakpoints.screenSM}) {
      padding: 0 0.5rem;
    } 
  } 

  .select-header-caret {
    position: absolute;
    right: 0.75rem;
    transform: rotate(0);
    transition: transform 0.3s linear;

    @media (max-width: ${breakpoints.screenSM}) {
      right: 0.5rem;
    } 

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
`

