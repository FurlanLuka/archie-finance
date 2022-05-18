import styled from 'styled-components'

export const EmailVerificationStyled = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.backgroundAlert};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 0.5rem;
  width: 100%;
  padding: 0.75rem 3rem;
  margin-bottom: 1.5rem;

  .image {
    max-height: 3rem;
    max-width: 4rem;
    margin-right: 1.5rem;
  }

  img {
    height: 100%;
  }

  button {
    border: 0;
    background-color: ${({ theme }) => theme.buttonOutline};
    font-weight: 700;
    padding: 0 0.25rem;
    cursor: pointer;
  }
`