import styled, { keyframes } from 'styled-components';

interface LoaderProps {
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

export const LoaderStyled = styled.div<LoaderProps>`
  width: 50px;
  height: 35px;
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
