import { Story } from '@ladle/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyL, BodyS } from '../typography/typography.styled';

import { InputCheckbox } from './input-checkbox.styled';

export default {
  title: 'Components/Input Checkbox',
  component: InputCheckbox,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input checkbox" subtitle="default" />
    <InputCheckbox>
      <input type="checkbox" onChange={() => alert('Checked!')} />
      <BodyL>Set Autopay on</BodyL>
    </InputCheckbox>
  </StoriesContainer>
);

export const Small: Story = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Input checkbox" subtitle="small" />
    <InputCheckbox {...props}>
      <input type="checkbox" onChange={() => alert('Checked!')} />
      <BodyS>Set Autopay on</BodyS>
    </InputCheckbox>
  </StoriesContainer>
);

Small.args = {
  small: true,
};

export const Disabled: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Input checkbox" subtitle="disabled" />
    <InputCheckbox>
      <input type="checkbox" checked disabled />
      <BodyL>Set Autopay on</BodyL>
    </InputCheckbox>
  </StoriesContainer>
);
