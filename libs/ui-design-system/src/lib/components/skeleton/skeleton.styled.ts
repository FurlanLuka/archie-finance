import styled from 'styled-components';

export const Skeleton = styled.div`
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #dddbdd;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(#fff, 0) 0, rgba(#fff, 0.2) 20%, rgba(#fff, 0.5) 60%, rgba(#fff, 0));
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;
