import { breakpoints, HEADER_HEIGHT } from '@archie-webapps/ui-theme';
import styled from 'styled-components';

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

  @media (max-width: ${breakpoints.screenMD}) {
    display: none;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
  }

  p {
    padding-bottom: 0.2rem;
  }
`;
