import styled, { keyframes } from 'styled-components';

export interface LoaderProps {
  color?: string;
  marginAuto?: boolean;
}

const stretchdelay = keyframes`
  0%, 40%, 100% { 
    transform: translateY(25%);
  }  
  20% { 
    transform: translateY(0%);
  }
`;

const prixClipFix = keyframes`
  0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
  25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
  50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
  75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
  100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
`

export const Loader = styled.div<LoaderProps>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  transform: rotate(45deg);
  background-color: ${({ color, theme }) => color ?? theme.loaderBackground};

  ::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: ${({ color, theme }) => color ?? `24px solid ${theme.loadingDot}`}; 
    animation: ${prixClipFix} 2s infinite linear;
  }
`

export const LoaderStyled = styled.div<LoaderProps>`
  width: 50px;
  height: 32px;
  margin: ${({ marginAuto }) => marginAuto && 'auto'};

  .rect {
    display: inline-block;
    background-color: ${({ color, theme }) => color ?? theme.loaderBackground};
    height: 100%;
    width: 5px;
    margin-left: 2px;
    animation: ${stretchdelay} 1.2s infinite ease-in-out;

    &.rect2 {
      animation-delay: -1.1s;
    }

    &.rect3 {
      animation-delay: -1s;
    }

    &.rect4 {
      animation-delay: -0.9s;
    }

    &.rect5 {
      animation-delay: -0.8s;
    }
  }
`;
