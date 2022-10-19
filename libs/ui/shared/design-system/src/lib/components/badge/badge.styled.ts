import styled from 'styled-components';

export interface BadgeProps {
  statusColor: string;
}

export const Badge = styled.div<BadgeProps>`
  font-size: 0.625rem;
  line-height: 1.6;
  font-weight: 700;
  color: ${({ statusColor }) => statusColor};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1px solid ${({ statusColor }) => statusColor};
  border-radius: 0.5rem;
  max-width: fit-content;
  padding: 0 1rem;
`;
