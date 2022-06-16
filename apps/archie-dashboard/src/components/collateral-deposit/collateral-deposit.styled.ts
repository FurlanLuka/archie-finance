import styled from 'styled-components'

import breakpoints from '../../constants/ui/breakpoints';

export const CollateralDepositStyled = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 0.6rem 1rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.6rem 0.5rem;
  } 
`