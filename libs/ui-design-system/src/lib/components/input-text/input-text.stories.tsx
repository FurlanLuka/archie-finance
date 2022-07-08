import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { InputText } from './input-text.styled';

export default {
  title: 'Components/Input Text',
  component: InputText,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input text" subtitle="primary" />
    <div style={{ maxWidth: '30%' }}>
      <InputText>
        Join the Waitlist
        <input placeholder="Email address" />
      </InputText>
    </div>
  </StoriesContainer>
);
