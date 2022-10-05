import styled from 'styled-components';

export const MarginCallAlertStyled = styled.div<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 0.5rem;
  width: 100%;
  margin-bottom: 1.5rem;

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1.5rem;
  }

  button {
    margin-top: 0.5rem;
  }
`;
