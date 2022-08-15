import styled from 'styled-components';

import { breakpoints, HEADER_HEIGHT } from '@archie-webapps/shared/ui/theme';

export const Toast = styled.div`
  position: fixed;
  top: calc(${HEADER_HEIGHT} + 1rem);
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.backgroundPositive};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  padding: 1rem 1.5rem;
  z-index: 4;

  @media (max-width: ${breakpoints.screenMD}) {
    top: auto;
    bottom: 1rem;
    right: 2rem;
  }

  .btn-group {
    margin-top: 0.5rem;
  }
`;

export const ToastList = styled.div`
  
`;
