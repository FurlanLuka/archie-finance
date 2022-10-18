import styled from 'styled-components';

export const AlignCenterCellStyled = styled.div`
  display: flex;
  justify-content: center;
`;

export const AlignEndCellStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ChangeCellStyled = styled(AlignCenterCellStyled)<{
  isPositive: boolean;
}>`
  position: relative;
  gap: 0.25rem;
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.textSuccess : theme.textDanger};
`;

export const ActionsCellStyled = styled.div`
  display: flex;
  gap: 0.25rem;

  button {
    padding: 0.25rem;
  }
`;
