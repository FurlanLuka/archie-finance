import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { ButtonLight } from '../button/button.styled';
import { ParagraphXS } from '../typography/typography.styled';

import { Toast } from './toast.styled';

export default {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta;

export const Default: Story = () => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Toast" subtitle="default" />
    <Toast>
      <ParagraphXS weight={700}>
        You have collateralized 0.3 ETH and will have an initial credit line of $285.
      </ParagraphXS>
      <div className="btn-group">
        <ButtonLight small maxWidth="fit-content">
          Continue
        </ButtonLight>
      </div>
    </Toast>
  </StoriesContainer>
);
