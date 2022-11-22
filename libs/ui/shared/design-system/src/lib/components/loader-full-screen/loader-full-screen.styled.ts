import styled from 'styled-components';

export const LoaderFullScreenStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.loadingBackground};
  z-index: 9999999999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
