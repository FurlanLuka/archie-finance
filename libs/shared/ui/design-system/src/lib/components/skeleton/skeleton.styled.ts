import styled, { keyframes } from 'styled-components';

const load = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

export interface SkeletonProps {
  bgColor?: string;
}

export const Skeleton = styled.div<SkeletonProps>`
  position: absolute;
  background-color: ${({ bgColor }) => bgColor};
  height: 100%;
  width: 100%;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(to right, #fff 8%, #ececec 38%, #fff 54%);
    animation: ${load} 1s linear infinite;
  }
`;
