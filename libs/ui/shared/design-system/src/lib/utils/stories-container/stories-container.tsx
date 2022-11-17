import { FC, PropsWithChildren } from 'react';

import { StoriesContainerStyled } from './stories-container.styled';

export interface StoriesContainerProps extends PropsWithChildren {
  bgColor?: string;
}

export const StoriesContainer: FC<StoriesContainerProps> = ({
  children,
  bgColor,
}) => (
  <StoriesContainerStyled bgColor={bgColor}>{children}</StoriesContainerStyled>
);
