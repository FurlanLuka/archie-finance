import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/ui-theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import {
  TypographyProps,
  Headline,
  Title,
  SubtitleL,
  SubtitleM,
  SubtitleS,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
} from './typography.styled';

export default {
  title: 'Theme/Typography',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story<TypographyProps> = (args) => (
  <StoriesContainer>
    <StoriesTitle title="Typography" />
    <Headline {...args}>Archie Finance</Headline>
    <Title {...args}>Archie Finance</Title>
    <SubtitleL {...args}>Archie Finance</SubtitleL>
    <SubtitleM {...args}>Archie Finance</SubtitleM>
    <SubtitleS {...args}>Archie Finance</SubtitleS>
    <hr />
    <ParagraphM {...args}>Finally, a crypto collateralized credit card for everyday payme</ParagraphM>
    <ParagraphS {...args}>Finally, a crypto collateralized credit card for everyday payme</ParagraphS>
    <ParagraphXS {...args}>Finally, a crypto collateralized credit card for everyday payme</ParagraphXS>
    <ParagraphXXS {...args}>Finally, a crypto collateralized credit card for everyday payme</ParagraphXXS>
  </StoriesContainer>
);

Default.args = {
  color: theme.textPrimary,
  weight: 400,
};
