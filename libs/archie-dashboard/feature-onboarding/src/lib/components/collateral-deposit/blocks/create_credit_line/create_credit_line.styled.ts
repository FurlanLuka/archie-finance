import styled from 'styled-components';

export const FloatingCreditLine = styled.div`
  z-index: 4;
  position: fixed;
  bottom: 1rem;
  right: 1rem;

  max-width: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border: 2px solid ${({ theme }) => theme.borderHighlight};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundPrimary};

  padding: 1rem;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);

  .creditInfo {
    margin-bottom: 0.5rem;
  }
`;
