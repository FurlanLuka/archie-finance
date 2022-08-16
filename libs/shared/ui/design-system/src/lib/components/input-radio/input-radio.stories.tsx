import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { ParagraphS, ParagraphXXS } from '../typography/typography.styled';

import { InputRadio } from './input-radio.styled';

export default {
  title: 'Components/Input Radio',
  component: InputRadio,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input radio" subtitle="default" />
    <InputRadio>
      <input type="radio" name="radio-group" value="first-item" />
      <ParagraphS>Join the Waitlist</ParagraphS>
    </InputRadio>
  </StoriesContainer>
);

export const Small: Story = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Input text" subtitle="small" />
    <InputRadio {...props}>
      <input type="radio" name="radio-group" value="first-item" />
      <ParagraphXXS>Join the Waitlist</ParagraphXXS>
    </InputRadio>
  </StoriesContainer>
);

Small.args = {
  small: true,
};

export const Disabled: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input text" subtitle="disabled" />
    <InputRadio>
      <input type="radio" name="radio-group" value="first-item" checked disabled />
      <ParagraphS>Join the Waitlist</ParagraphS>
    </InputRadio>
  </StoriesContainer>
);
