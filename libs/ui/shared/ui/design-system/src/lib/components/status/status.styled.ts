import styled from 'styled-components';

export interface StatusProps {
  isOn?: boolean;
}

export const StatusCircle = styled.div`
  border-radius: 100%;
  width: 1rem;
  height: 1rem;
`;

export const Status = styled.div<StatusProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  ${StatusCircle} {
    background-color: ${({ theme, isOn }) =>
      isOn ? theme.backgroundSuccess : theme.backgroundTransparent};
    border: 2px solid
      ${({ theme, isOn }) => (isOn ? theme.textSuccess : theme.textSecondary)};
  }

  p {
    color: ${({ theme, isOn }) =>
      isOn ? theme.textPrimary : theme.textSecondary};
  }
`;
