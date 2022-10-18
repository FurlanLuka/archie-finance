import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { ButtonGhost, ButtonLight } from '../button/button.styled';
import { BodyM } from '../typography/typography.styled';

import { Toast, ToastList } from './toast.styled';

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
      <BodyM weight={700}>
        This is a toast notification. You can wrap anything you want in it.
      </BodyM>
      <div className="btn-group">
        <ButtonLight small>Ok</ButtonLight>
      </div>
    </Toast>
  </StoriesContainer>
);

export const InAToastList: Story = () => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Toast" subtitle="in a toast list" />
    <ToastList>
      <Toast>
        <BodyM weight={700}>
          This is a toast notification. You can wrap anything you want in it.
        </BodyM>
      </Toast>
      <Toast>
        <BodyM weight={700}>Here is a notification with a button.</BodyM>
        <div className="btn-group">
          <ButtonLight small>Ok</ButtonLight>
        </div>
      </Toast>
      <Toast>
        <BodyM weight={700}>This one is with two buttons.</BodyM>
        <div className="btn-group">
          <ButtonLight small>Cool</ButtonLight>
          <ButtonGhost small>Cancel</ButtonGhost>
        </div>
      </Toast>
    </ToastList>
  </StoriesContainer>
);
