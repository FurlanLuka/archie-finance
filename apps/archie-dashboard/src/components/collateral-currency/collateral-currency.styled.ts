import styled from 'styled-components'

export const CollateralCurrencyStyled = styled.div`
  display: flex;
  align-items: center;

  p {
    line-height: 1.1;
    letter-spacing: 0.02em;
  }

  .icon {
    display: flex;
    background-color: ${({ theme }) => theme.textDisabled};
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    margin-right: 0.5rem;
  }

  .name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    letter-spacing: 0.02em;
  }
  
`