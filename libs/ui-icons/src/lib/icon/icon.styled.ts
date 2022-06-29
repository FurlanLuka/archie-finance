import styled from 'styled-components';

export const Icon = styled.div<{ fill?: string }>`
  display: inline-block;

  color: ${({ fill, theme }) => fill ?? theme.textPrimary};
`;
