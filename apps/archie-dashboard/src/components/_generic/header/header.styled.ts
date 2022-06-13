import styled from 'styled-components'

import breakpoints from '../../../constants/breakpoints'

export const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-bottom: 1px solid ${({theme }) => theme.borderPrimary};
  width: 100%;
  padding: 1.5rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.75rem 1rem;
  }

  .logo {
    margin-bottom: 4px;
    
    @media (max-width: ${breakpoints.screenSM}) {
      width: 84px;
    }
  }
`

