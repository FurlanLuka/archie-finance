import styled from 'styled-components'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../../../constants/ui/elements'
import breakpoints from '../../../../constants/ui/breakpoints'

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

  @media (max-width: ${breakpoints.screenSM}) {
    margin-top: ${HEADER_HEIGHT_MOBILE};
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
`

