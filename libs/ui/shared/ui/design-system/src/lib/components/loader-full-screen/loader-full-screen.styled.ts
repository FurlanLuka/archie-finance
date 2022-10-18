import styled from 'styled-components';

export const LoaderFullScreenStyled = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.loadingBackground};
  width: 100%;
  height: 100%;
  z-index: 9999999999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
