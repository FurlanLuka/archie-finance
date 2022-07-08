import { Story, Meta } from '@storybook/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { ModalProps, Modal } from './modal';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story<ModalProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Modal" />
    <Modal {...props}>Modal Title</Modal>
  </StoriesContainer>
);

Default.args = {
  isOpen: true,
  close: () => console.log('close'),
  maxWidth: '600px',
};
