import { Story, Meta } from '@storybook/react';

import { Card } from '../card/card.styled';
import { SubtitleM } from '../typography/typography.styled';

import { Page, Container } from './layout.styled';

export default {
  title: 'Layout/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta;

export const Default: Story = () => (
  <Page>
    <Container justifyContent="center" alignItems="flex-start">
      <Card maxWidth="600px" padding="2rem">
        <div style={{ textAlign: 'center' }}>
          <SubtitleM weight={700}>You can enter anything you want here</SubtitleM>
        </div>
      </Card>
    </Container>
  </Page>
);
