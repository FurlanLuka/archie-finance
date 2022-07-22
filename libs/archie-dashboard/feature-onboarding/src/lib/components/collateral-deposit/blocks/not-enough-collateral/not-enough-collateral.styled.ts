import styled from 'styled-components';

export const NotEnoughCollateralStyled = styled.div`
  z-index: 4;
  position: fixed;
  top: 1rem;
  left: auto;
  right: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.borderHighlight};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundAlert};
  padding: 1rem;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
`;
