import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

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

export const Default: Story<TypographyProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Typography" />
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '20%', paddingBottom: '0.6rem' }}>
        <ParagraphXS>(Headline)</ParagraphXS>
      </div>
      <Headline {...props} weight={800}>
        Archie Finance
      </Headline>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '20%', paddingBottom: '0.5rem' }}>
        <ParagraphXS>(Title)</ParagraphXS>
      </div>
      <Title {...props} weight={800}>
        Archie Finance
      </Title>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '20%', paddingBottom: '0.25rem' }}>
        <ParagraphXS>(SubtitleL)</ParagraphXS>
      </div>
      <SubtitleL {...props} weight={800}>
        Archie Finance
      </SubtitleL>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '20%', paddingBottom: '0.25rem' }}>
        <ParagraphXS>(SubtitleM)</ParagraphXS>
      </div>
      <SubtitleM {...props} weight={800}>
        Archie Finance
      </SubtitleM>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '20%', paddingBottom: '0.2rem' }}>
        <ParagraphXS>(SubtitleS)</ParagraphXS>
      </div>
      <SubtitleS {...props} weight={800}>
        Archie Finance
      </SubtitleS>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '20%', paddingBottom: '0.15rem' }}>
        <ParagraphXS>(ParagraphM)</ParagraphXS>
      </div>
      <ParagraphM {...props}>Finally, a crypto collateralized credit card for everyday payme</ParagraphM>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '20%', paddingBottom: '0.1rem' }}>
        <ParagraphXS>(ParagraphS)</ParagraphXS>
      </div>
      <ParagraphS {...props}>Finally, a crypto collateralized credit card for everyday payme</ParagraphS>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '20%', paddingBottom: '0.1rem' }}>
        <ParagraphXS>(ParagraphXS)</ParagraphXS>
      </div>
      <ParagraphXS {...props}>Finally, a crypto collateralized credit card for everyday payme</ParagraphXS>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '20%' }}>
        <ParagraphXS>(ParagraphXXS)</ParagraphXS>
      </div>
      <ParagraphXXS {...props}>Finally, a crypto collateralized credit card for everyday payme</ParagraphXXS>
    </div>
  </StoriesContainer>
);

Default.args = {
  color: theme.textPrimary,
  weight: 400,
};
