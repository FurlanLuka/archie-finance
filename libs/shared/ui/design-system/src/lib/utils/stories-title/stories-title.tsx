import { FC } from 'react';

import { TitleM, BodyL } from '../../components/typography/typography.styled';

import { StoriesTitleStyled } from './stories-title.styled';

interface StoriesTitleProps {
  title?: string;
  subtitle?: string;
}

export const StoriesTitle: FC<StoriesTitleProps> = ({ title, subtitle }) => (
  <StoriesTitleStyled>
    <TitleM weight={700}>{title}</TitleM>
    <BodyL>{subtitle}</BodyL>
  </StoriesTitleStyled>
);
