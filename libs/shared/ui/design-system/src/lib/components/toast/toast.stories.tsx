import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { ButtonGhost, ButtonLight } from '../button/button.styled';
import { ParagraphXS } from '../typography/typography.styled';

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
      <ParagraphXS weight={700}>This is a toast notification. You can wrap anything you want in it.</ParagraphXS>
      <div className="btn-group">
        <ButtonLight small maxWidth="fit-content">
          Ok
        </ButtonLight>
      </div>
    </Toast>
  </StoriesContainer>
);

export const InAToastList: Story = () => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Toast" subtitle="in a toast list" />
    <ToastList>
      <Toast>
        <ParagraphXS weight={700}>This is a toast notification. You can wrap anything you want in it.</ParagraphXS>
      </Toast>
      <Toast>
        <ParagraphXS weight={700}>Here is a notification with a button.</ParagraphXS>
        <div className="btn-group">
          <ButtonLight small maxWidth="fit-content">
            Ok
          </ButtonLight>
        </div>
      </Toast>
      <Toast>
        <ParagraphXS weight={700}>This one is with two buttons.</ParagraphXS>
        <div className="btn-group">
          <ButtonLight small maxWidth="fit-content">
            Cool
          </ButtonLight>
          <ButtonGhost small maxWidth="fit-content">
            Cancel
          </ButtonGhost>
        </div>
      </Toast>
    </ToastList>
  </StoriesContainer>
);
