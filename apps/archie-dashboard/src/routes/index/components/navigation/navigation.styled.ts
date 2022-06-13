import styled from 'styled-components'

export const NavigationStyled = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  min-width: 13rem;
  padding: 3rem 2rem;

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

