import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyL, BodyS } from '../typography/typography.styled';

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
      <BodyL>Join the Waitlist</BodyL>
    </InputRadio>
  </StoriesContainer>
);

export const Small: Story = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Input radio" subtitle="small" />
    <InputRadio {...props}>
      <input type="radio" name="radio-group" value="first-item" />
      <BodyS>Join the Waitlist</BodyS>
    </InputRadio>
  </StoriesContainer>
);

Small.args = {
  small: true,
};

export const Disabled: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input radio" subtitle="disabled" />
    <InputRadio>
      <input
        type="radio"
        name="radio-group"
        value="first-item"
        checked
        disabled
      />
      <BodyL>Join the Waitlist</BodyL>
    </InputRadio>
  </StoriesContainer>
);
