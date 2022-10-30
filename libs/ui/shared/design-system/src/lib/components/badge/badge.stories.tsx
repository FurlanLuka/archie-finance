import { Story, Meta } from '@storybook/react';

import { LTVStatus, LTVText, LTVColor } from '@archie/ui/shared/constants';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { Badge, BadgeProps } from './badge.styled';

export default {
  title: 'Components/Badge',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Good: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="good" />
    <Badge {...props}>{LTVText[LTVStatus.GOOD]}</Badge>
  </StoriesContainer>
);

Good.args = {
  statusColor: LTVColor[LTVStatus.GOOD],
};

export const Ok: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="ok" />
    <Badge {...props}>{LTVText[LTVStatus.OK]}</Badge>
  </StoriesContainer>
);

Ok.args = {
  statusColor: LTVColor[LTVStatus.OK],
};

export const Warning: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="warning" />
    <Badge {...props}>{LTVText[LTVStatus.WARNING]}</Badge>
  </StoriesContainer>
);

Warning.args = {
  statusColor: LTVColor[LTVStatus.WARNING],
};

export const MarginCall: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="margin call" />
    <Badge {...props}>{LTVText[LTVStatus.MARGIN_CALL]}</Badge>
  </StoriesContainer>
);

MarginCall.args = {
  statusColor: LTVColor[LTVStatus.MARGIN_CALL],
};
