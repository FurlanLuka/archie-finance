import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/ui-theme';

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
} as Meta;

export const Template: Story<TypographyProps> = (args) => (
  <>
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
  </>
);
Template.args = {
  color: theme.textPrimary,
  weight: 400,
};
