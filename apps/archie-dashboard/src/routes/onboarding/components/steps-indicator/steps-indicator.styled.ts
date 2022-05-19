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
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 6rem;
  }

  .circle {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    background-color:  ${({ theme }) => theme.textSecondary};
    margin-bottom: 0.5rem;
  }
`