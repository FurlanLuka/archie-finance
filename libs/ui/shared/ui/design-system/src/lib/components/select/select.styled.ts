import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export interface SelectStyledProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string;
  small?: boolean;
}

export interface SelectOptionStyledProps {
  small?: boolean;
}

export const SelectStyled = styled.div<SelectStyledProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: ${({ width }) => width};

  .select-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: ${({ small }) => (small ? '0.25rem' : '0.5rem')};
    border: 1px solid
      ${({ theme, isDisabled, isLoading }) =>
        isDisabled || isLoading ? theme.buttonDisabled : theme.borderHighlight};
    height: ${({ small }) => (small ? '1.5rem' : '3rem')};
    width: 100%;
    padding: 0 0.75rem 0 1rem;
    pointer-events: ${({ isDisabled, isLoading }) =>
      isDisabled || isLoading ? 'none' : 'all'};
    cursor: pointer;

    @media (max-width: ${breakpoints.screenSM}) {
      padding: 0 0.5rem;
    }

    & > :first-child {
      flex: 1;
    }
  }

  .select-header-caret {
    margin-left: auto;
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
    width: 100%;
    position: absolute;
    display: flex;
    top: 100%;
    flex-direction: column;
    align-items: flex-start;
    background-color: ${({ theme }) => theme.backgroundPrimary};
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.12);
    border-radius: 0.5rem;
    z-index: 1;
  }

  .select-option {
    width: 100%;
    cursor: pointer;

    :hover {
      background: ${({ theme }) => theme.backgroundSecondary};
    }
  }
`;

export const SelectOptionStyled = styled.div<SelectOptionStyledProps>`
  padding: 0.5rem 1rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.5rem;
  }
`;
