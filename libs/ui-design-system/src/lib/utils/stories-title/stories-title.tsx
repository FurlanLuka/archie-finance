import { FC } from 'react';

import { SubtitleS, ParagraphS } from '../../components/typography/typography.styled';

import { StoriesTitleStyled } from './stories-title.styled';

interface StoriesTitleProps {
  title?: string;
  subtitle?: string;
}

export const StoriesTitle: FC<StoriesTitleProps> = ({ title, subtitle }) => (
  <StoriesTitleStyled>
    <SubtitleS weight={700}>{title}</SubtitleS>
    <ParagraphS>{subtitle}</ParagraphS>
  </StoriesTitleStyled>
);
