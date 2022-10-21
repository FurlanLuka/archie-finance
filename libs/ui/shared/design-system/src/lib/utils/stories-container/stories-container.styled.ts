import styled from 'styled-components';

interface StoriesContainerProps {
  bgColor?: string;
}

export const StoriesContainerStyled = styled.div<StoriesContainerProps>`
  background-color: ${({ theme, bgColor }) =>
    bgColor ?? theme.backgroundPrimary};
  height: 100vh;
  padding: 2rem;
`;
