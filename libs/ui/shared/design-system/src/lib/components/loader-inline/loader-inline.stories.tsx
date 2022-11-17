import { Story } from '@ladle/react';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';

import { LoaderInline, LoaderInlineProps } from './loader-inline.styled';

export default {
  title: 'Components/Loader Inline',
  component: LoaderInline,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Primary: Story<LoaderInlineProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Loader Inline" subtitle="primary" />
    <LoaderInline {...props} />
  </StoriesContainer>
);

Primary.args = {
  marginAuto: false,
  small: false,
};

// Maybe it doesn't make sense to have both versions, discuss it
export const Small: Story<LoaderInlineProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Loader Inline" subtitle="smaller" />
    <LoaderInline {...props} />
  </StoriesContainer>
);

Small.args = {
  marginAuto: false,
  small: true,
};
