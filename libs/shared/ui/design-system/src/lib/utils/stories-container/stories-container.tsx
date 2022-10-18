import { FC } from 'react';

import { StoriesContainerStyled } from './stories-container.styled';

interface StoriesContainerProps {
  bgColor?: string;
}

export const StoriesContainer: FC<StoriesContainerProps> = ({ children, bgColor }) => (
  <StoriesContainerStyled bgColor={bgColor}>{children}</StoriesContainerStyled>
);
