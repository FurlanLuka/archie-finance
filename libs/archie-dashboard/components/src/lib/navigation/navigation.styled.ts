import styled from 'styled-components';

import { breakpoints, HEADER_HEIGHT } from '@archie-webapps/shared/ui/theme';

export const NavigationStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  height: 100%;
  min-width: 13rem;
  padding: 3rem 2rem;
  margin-top: ${HEADER_HEIGHT};
  z-index: 1;

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
