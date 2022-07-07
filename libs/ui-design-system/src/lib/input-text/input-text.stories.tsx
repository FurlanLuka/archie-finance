import { Story, Meta } from '@storybook/react';

import { InputText } from './input-text.styled';

export default {
  title: 'Components/Input Text',
  component: InputText,
} as Meta;

export const Template: Story = () => (
  <div style={{ maxWidth: '30%' }}>
    <InputText>
      Join the Waitlist
      <input placeholder="Email address" />
    </InputText>
  </div>
);
