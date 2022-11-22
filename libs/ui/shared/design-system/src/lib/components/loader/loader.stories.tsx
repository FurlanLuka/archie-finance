import { Story } from '@ladle/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { Loader, LoaderProps } from './loader.styled';

export default {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Primary: Story<LoaderProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Loader" subtitle="primary" />
    <Loader {...props} />
  </StoriesContainer>
);

Primary.args = {
  marginAuto: false,
  small: false,
};

export const Small: Story<LoaderProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Loader" subtitle="smaller" />
    <Loader {...props} />
  </StoriesContainer>
);

Small.args = {
  marginAuto: false,
  small: true,
};
