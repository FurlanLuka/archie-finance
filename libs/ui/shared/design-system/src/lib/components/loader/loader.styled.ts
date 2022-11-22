import styled, { keyframes } from 'styled-components';

const flash = keyframes`
  0% {
    background-color: #bdc0c1;
    box-shadow: 12px 0 #bdc0c1, -12px 0 #9fa3a4;
  }
  50% {
    background-color: #9fa3a4;
    box-shadow: 12px 0 #bdc0c1, -12px 0 #bdc0c1;
  }
  100% {
    background-color: #bdc0c1;
    box-shadow: 12px 0 #9fa3a4, -12px 0 #bdc0c1;
  }
`

export interface LoaderProps {
  marginAuto?: boolean;
  small?: boolean;
}

export const Loader = styled.div<LoaderProps>`
  background-color: ${({ theme }) => theme.loadingDotActive};
  box-shadow: ${({ theme }) => `12px 0 ${theme.loadingDotActive}, -12px 0 ${theme.loadingDotActive}`};
  border-radius: 100%;
  width: ${({ small }) => (small ? '0.4rem' : '0.5rem')};
  height: ${({ small }) => (small ? '0.4rem' : '0.5rem')};
  margin: 0 12px;
  animation: ${flash} 0.6s ease-out infinite alternate;
`;
