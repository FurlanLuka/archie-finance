import styled from 'styled-components';

interface StatusCellStyledProps {
  color: string;
}

export const StatusCellStyled = styled.div<StatusCellStyledProps>`
  color: ${({ color }) => color};
`;

export const DescriptionCellStyled = styled.div`
  .description-title {
    font-size: 1rem;
  }

  .description-code {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

export const AmountCellStyled = styled.div<{ isNegative: boolean }>`
  color: ${({ isNegative, theme }) => (isNegative ? theme.textDanger : theme.textSuccess)};
`;

export const TypeCellStyled = styled.div`
  font-size: 1rem;
`;
