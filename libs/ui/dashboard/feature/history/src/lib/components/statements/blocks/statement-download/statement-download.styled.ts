import styled from 'styled-components';

export const StatementDocumentLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.75rem;
  line-height: 1;
  font-weight: 700;

  width: 175px;
  padding: 0.25rem 1rem;

  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme }) => theme.buttonPrimary};
  border: ${({ theme }) => `1px solid ${theme.buttonPrimary}`};
`;
