import styled from 'styled-components'

export const InputText = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 700;
  letter-spacing: 0.02em;
  width: 100%;
  margin-bottom: 1.5rem;

  input {
    font-size: 0.875rem;
    line-height: 1;
    font-weight: 500;
    font-family: ${({ theme }) => theme.fontPrimary};
 		color: ${({ theme }) => theme.textPrimary};
    letter-spacing: 0.02em;
    padding: 1rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.borderHighlight};
    background-color: transparent;
    max-height: 3rem;
    width: 100%;
    margin-top: 0.35rem;

    ::placeholder {
      color: ${({ theme }) => theme.inputTextPlaceholder};
    }  
  }
`

