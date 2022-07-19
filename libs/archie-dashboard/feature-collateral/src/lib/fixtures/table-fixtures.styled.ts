import styled from 'styled-components';

export const AllocationCellStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ChangeCellStyled = styled.div<{ isPositive: boolean }>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
  color: ${({ theme, isPositive }) => isPositive ? theme.textSuccess : theme.textDanger};
  padding-left: 0.5rem;
`;

export const ActionsCellStyled = styled.div`
  display: flex;
  gap: 0.25rem;

  button {
    padding: 0.25rem;
  }
`;
