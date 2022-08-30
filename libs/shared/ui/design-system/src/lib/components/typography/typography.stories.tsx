import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import {
  TypographyProps,
  HeadlineL,
  HeadlineM,
  HeadlineS,
  TitleL,
  TitleM,
  TitleS,
  BodyL,
  BodyM,
  BodyS,
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
      <div style={{ width: '15%', paddingBottom: '0.6rem' }}>
        <BodyM weight={800}>(Headline L)</BodyM>
      </div>
      <HeadlineL {...props} weight={800}>
        Archie Finance
      </HeadlineL>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '15%', paddingBottom: '0.5rem' }}>
        <BodyM weight={800}>(Headline M)</BodyM>
      </div>
      <HeadlineM {...props} weight={800}>
        Archie Finance
      </HeadlineM>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '15%', paddingBottom: '0.25rem' }}>
        <BodyM weight={800}>(Headline S)</BodyM>
      </div>
      <HeadlineS {...props} weight={800}>
        Archie Finance
      </HeadlineS>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '15%', paddingBottom: '0.25rem' }}>
        <BodyM weight={800}>(Title L)</BodyM>
      </div>
      <TitleL {...props} weight={800}>
        Archie Finance
      </TitleL>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '15%', paddingBottom: '0.2rem' }}>
        <BodyM weight={800}>(Title M)</BodyM>
      </div>
      <TitleM {...props} weight={800}>
        Archie Finance
      </TitleM>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '15%', paddingBottom: '0.15rem' }}>
        <BodyM weight={800}>(Title S)</BodyM>
      </div>
      <TitleS {...props} weight={800}>
        Archie Finance
      </TitleS>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '15%', paddingBottom: '0.1rem' }}>
        <BodyM weight={800}>(Body L)</BodyM>
      </div>
      <BodyL {...props}>Finally, a crypto collateralized credit card for everyday payments</BodyL>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '15%', paddingBottom: '0.1rem' }}>
        <BodyM weight={800}>(Body M)</BodyM>
      </div>
      <BodyM {...props}>Finally, a crypto collateralized credit card for everyday payments</BodyM>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div style={{ width: '15%' }}>
        <BodyM weight={800}>(Body S)</BodyM>
      </div>
      <BodyS {...props}>Finally, a crypto collateralized credit card for everyday payments</BodyS>
    </div>
  </StoriesContainer>
);

Default.args = {
  color: theme.textPrimary,
  weight: 400,
};
