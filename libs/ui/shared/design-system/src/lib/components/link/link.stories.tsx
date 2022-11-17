import { Story } from '@ladle/react';

import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyL } from '../typography/typography.styled';

import {
  Link,
  LinkProps,
  LinkAsButtonProps,
  LinkAsButtonPrimary,
  LinkAsButtonOutline,
  LinkAsButtonGhost,
  LinkAsButtonLight,
} from './link.styled';

export default {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
};

export const Default: Story<LinkProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Link" subtitle="default" />
    <BodyL>
      <Link {...props} href="#" target="_blank">
        Read more <Icon name="external-link" fill={theme.textHighlight} />
      </Link>
    </BodyL>
  </StoriesContainer>
);

Default.args = {
  isDisabled: false,
  color: '',
  padding: '',
};

export const AsButton: Story<LinkAsButtonProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Link as button" subtitle="primary" />
    <LinkAsButtonPrimary {...props} href="#" target="_blank">
      Read more <Icon name="external-link" fill={theme.textLight} />
    </LinkAsButtonPrimary>
  </StoriesContainer>
);

AsButton.args = {
  isLoading: false,
  isDisabled: false,
  width: 'fit-content',
  small: false,
  color: '',
};

export const AsButtonOutline: Story<LinkAsButtonProps> = (props) => (
  <StoriesContainer>
    <StoriesTitle title="Link as button" subtitle="outline" />
    <LinkAsButtonOutline {...props} href="#" target="_blank">
      Read more <Icon name="external-link" fill={theme.textHighlight} />
    </LinkAsButtonOutline>
  </StoriesContainer>
);

AsButtonOutline.args = {
  isLoading: false,
  isDisabled: false,
  width: 'fit-content',
  small: false,
  color: '',
};

export const AsButtonGhost: Story<LinkAsButtonProps> = (props) => (
  <StoriesContainer bgColor="#ececec">
    <StoriesTitle title="Link as button" subtitle="ghost" />
    <LinkAsButtonGhost {...props} href="#" target="_blank">
      Read more <Icon name="external-link" fill={theme.textLight} />
    </LinkAsButtonGhost>
  </StoriesContainer>
);

AsButtonGhost.args = {
  isLoading: false,
  isDisabled: false,
  width: 'fit-content',
  small: false,
  color: '',
};

export const AsButtonLight: Story<LinkAsButtonProps> = (props) => (
  <StoriesContainer bgColor="#ececec">
    <StoriesTitle title="Link as button" subtitle="light" />
    <LinkAsButtonLight {...props} href="#" target="_blank">
      Read more <Icon name="external-link" fill={theme.textDanger} />
    </LinkAsButtonLight>
  </StoriesContainer>
);

AsButtonLight.args = {
  isLoading: false,
  isDisabled: false,
  width: 'fit-content',
  small: false,
  color: theme.textDanger,
};
