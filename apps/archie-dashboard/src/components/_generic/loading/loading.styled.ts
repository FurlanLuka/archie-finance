import styled, { keyframes } from 'styled-components'

const stretchdelay = keyframes`
  0%, 40%, 100% { 
    transform: translateY(25%);
  }  
  20% { 
    transform: translateY(0%);
  }
`

export const LoadingStyled = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.loaderBackground};
  width: 100%;
  height: 100%;
  z-index: 9999999999;

  .inner {
    position: fixed;
    width: 50px;
    height: 35px;
    top: calc(50% - 35px/2);
    left: calc(50% - 50px/2);
  }

  .rect {
    display: inline-block;
    background-color: ${({ theme }) => theme.backgroundPrimary};
    height: 100%;
    width: 5px;
    margin-left: 2px;
    animation: ${stretchdelay} 1.2s infinite ease-in-out;

    &.rect2 {
      animation-delay: -1.1s;
    }

    &.rect3 {
      animation-delay: -1.0s;
    }

    &.rect4 {
      animation-delay: -0.9s;
    }

    &.rect5 {
      animation-delay: -0.8s;
    }
  }

`

