import { Story, Meta } from '@storybook/react';
import { useState } from 'react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { ButtonOutline, ButtonPrimary } from '../button/button.styled';
import { TitleS, BodyM } from '../typography/typography.styled';

import { ModalProps, Modal } from './modal';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Default: Story<ModalProps> = (props) => {
  const [modalOpen, setModalOpen] = useState(true);

  const handleConfirm = () => {
    setModalOpen(false);
    alert('Confirmed');
  };

  return (
    <StoriesContainer>
      <StoriesTitle title="Modal" />
      <ButtonPrimary onClick={() => setModalOpen(true)}>Open Modal</ButtonPrimary>
      <Modal {...props} isOpen={modalOpen} close={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <TitleS>Show card details?</TitleS>
          <BodyM>Are you sure you want to display your card details?</BodyM>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <ButtonOutline maxWidth="100%" onClick={() => setModalOpen(false)}>
              Close
            </ButtonOutline>
            <ButtonPrimary maxWidth="100%" onClick={handleConfirm}>
              Confirm
            </ButtonPrimary>
          </div>
        </div>
      </Modal>
    </StoriesContainer>
  );
};

Default.args = {
  maxWidth: '420px',
};
