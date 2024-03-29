import { Story } from '@ladle/react';

import { theme } from '@archie/ui/shared/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { Card } from '../card/card.styled';

import { Error, ErrorProps } from './error';

export default {
  title: 'Layout/Error',
  component: Error,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Default: Story<ErrorProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Error" subtitle="default" />
    <Error {...props} />
  </StoriesContainer>
);

Default.args = {
  prevPath: '/collateral',
};

export const WithDescription: Story<ErrorProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Error" subtitle="default" />
    <Error {...props} />
  </StoriesContainer>
);

WithDescription.args = {
  prevPath: '/collateral',
  description: 'A more specific error description goes here.',
};

export const InsideCard: Story<ErrorProps> = (props) => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Error" subtitle="inside card" />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        justifyContent="center"
        maxWidth="800px"
        padding="2.5rem 1.5rem 3rem"
      >
        <Error {...props} />
      </Card>
    </div>
  </StoriesContainer>
);

InsideCard.args = {
  prevPath: '/collateral',
  description: 'A more specific error description goes here.',
};
