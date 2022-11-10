import type { StoryDecorator } from '@ladle/react';
import { Story } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { LTVText, LTVColor } from '@archie/ui/shared/constants';
import { GlobalStyles, theme } from '@archie/ui/shared/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { Badge, BadgeProps } from './badge.styled';

export default {
  title: 'Components/Badge',
  decorators: [
    (Component) => (
      <>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <Component />
        </ThemeProvider>
      </>
    ),
  ] as StoryDecorator[],
};

export const Good: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="good" />
    <Badge {...props}>{LTVText[LtvStatus.good]}</Badge>
  </StoriesContainer>
);

Good.args = {
  statusColor: LTVColor[LtvStatus.good],
};

export const Ok: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="ok" />
    <Badge {...props}>{LTVText[LtvStatus.ok]}</Badge>
  </StoriesContainer>
);

Ok.args = {
  statusColor: LTVColor[LtvStatus.ok],
};

export const Warning: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="warning" />
    <Badge {...props}>{LTVText[LtvStatus.warning]}</Badge>
  </StoriesContainer>
);

Warning.args = {
  statusColor: LTVColor[LtvStatus.warning],
};

export const MarginCall: Story<BadgeProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Badge" subtitle="margin call" />
    <Badge {...props}>{LTVText[LtvStatus.margin_call]}</Badge>
  </StoriesContainer>
);

MarginCall.args = {
  statusColor: LTVColor[LtvStatus.margin_call],
};
