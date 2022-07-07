import { Story, Meta } from '@storybook/react';

import { ModalProps, Modal } from './modal';

export default {
  title: 'Components/Modal',
  component: Modal,
} as Meta;

export const Template: Story<ModalProps> = (args) => <Modal {...args}>Modal Title</Modal>;
Template.args = {
  isOpen: true,
  close: () => console.log('close'),
  maxWidth: '600px',
};
