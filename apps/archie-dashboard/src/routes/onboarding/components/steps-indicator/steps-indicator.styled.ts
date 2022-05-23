import styled from 'styled-components'

export const StepsIndicatorStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;

  h4, p {
    margin-bottom: 1.5rem;
  }

  .steps {
    display: flex;
    gap: 6rem;
  }

  .step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 6rem;
  }

  .circle {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    background-color:  ${({ theme }) => theme.textDisabled};
    margin-bottom: 0.5rem;
  }

  .arrow {
    position: absolute;
    top: 0.5rem;
    right: -6rem;
  }
`