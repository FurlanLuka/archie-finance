import { Story, Meta } from '@storybook/react';

import { LoanToValueStatus, LoanToValueColor, LoanToValueText } from '@archie-webapps/archie-dashboard/constants';

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
    <Badge {...props}>{LoanToValueText[LoanToValueStatus.GOOD]}</Badge>
  </StoriesContainer>
);

Good.args = {
  statusColor: LoanToValueColor[LoanToValueStatus.GOOD],
};

export const Ok: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="ok" />
    <Badge {...props}>{LoanToValueText[LoanToValueStatus.OK]}</Badge>
  </StoriesContainer>
);

Ok.args = {
  statusColor: LoanToValueColor[LoanToValueStatus.OK],
};

export const Warning: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="warning" />
    <Badge {...props}>{LoanToValueText[LoanToValueStatus.WARNING]}</Badge>
  </StoriesContainer>
);

Warning.args = {
  statusColor: LoanToValueColor[LoanToValueStatus.WARNING],
};

export const MarginCall: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="margin call" />
    <Badge {...props}>{LoanToValueText[LoanToValueStatus.MARGIN_CALL]}</Badge>
  </StoriesContainer>
);

MarginCall.args = {
  statusColor: LoanToValueColor[LoanToValueStatus.MARGIN_CALL],
};
