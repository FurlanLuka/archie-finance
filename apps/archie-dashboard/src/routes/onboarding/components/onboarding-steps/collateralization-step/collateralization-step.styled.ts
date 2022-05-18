import styled from 'styled-components'

export const CollateralizationStepStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 1rem;
  width: 100%;
  padding: 2.5rem 12% 7rem;
  text-align: center;

  .title {
    margin-bottom: 1rem;
  }

  .subtitle {
    margin-bottom: 3rem;
  }

`