import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { InputText } from './input-text.styled';

export default {
  title: 'Components/Input Text',
  component: InputText,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input text" subtitle="default" />
    <div style={{ maxWidth: '30%' }}>
      <InputText>
        Join the Waitlist
        <input placeholder="Email address" />
      </InputText>
    </div>
  </StoriesContainer>
);

export const Small: Story = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Input text" subtitle="small" />
    <div style={{ maxWidth: '30%' }}>
      <InputText {...props}>
        Join the Waitlist
        <input placeholder="Email address" />
      </InputText>
    </div>
  </StoriesContainer>
);

Small.args = {
  small: true,
};
