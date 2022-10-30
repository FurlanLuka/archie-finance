import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyM } from '../typography/typography.styled';

import { Status, StatusCircle, StatusProps } from './status.styled';

export default {
  title: 'Components/Status',
  component: Status,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const On: Story<StatusProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Status" subtitle="on" />
    <Status {...props}>
      <StatusCircle />
      <BodyM weight={700}>auto-paymenys: {props.isOn ? 'on' : 'off'}</BodyM>
    </Status>
  </StoriesContainer>
);

On.args = {
  isOn: true,
};

export const Off: Story<StatusProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Status" subtitle="off" />
    <Status {...props}>
      <StatusCircle />
      <BodyM weight={700}>auto-paymenys: {props.isOn ? 'on' : 'off'}</BodyM>
    </Status>
  </StoriesContainer>
);

Off.args = {
  isOn: false,
};
