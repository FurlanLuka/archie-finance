import { Story } from '@ladle/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { Card } from '../card/card.styled';
import { TitleL } from '../typography/typography.styled';

import { Page, Container } from './layout.styled';

export default {
  title: 'Layout/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
};

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Page" />
    <Page>
      <Container justifyContent="center" alignItems="flex-start">
        <Card maxWidth="600px" padding="2rem">
          <div style={{ textAlign: 'center' }}>
            <TitleL weight={700}>You can enter anything you want here</TitleL>
          </div>
        </Card>
      </Container>
    </Page>
  </StoriesContainer>
);
