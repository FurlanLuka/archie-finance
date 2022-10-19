import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/ui/theme';

export const NavigationStyled = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  min-width: 13rem;
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenLG}) {
    min-width: auto;
  }

  @media (max-width: ${breakpoints.screenMD}) {
    display: none;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    cursor: pointer;

    p {
      color: ${({ theme }) => theme.navItem};
    }
  }

  .nav-item[aria-current] {
    p {
      color: ${({ theme }) => theme.navItemActive};
    }

    svg path {
      fill: ${({ theme }) => theme.navItemActive};
    }

    svg circle {
      stroke: ${({ theme }) => theme.navItemActive};
    }
  }

  .nav-item-title {
    padding-bottom: 0.2rem;

    @media (max-width: ${breakpoints.screenLG}) {
      display: none;
    }
  }
`;
