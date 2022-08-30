import { Story, Meta } from '@storybook/react';

import { theme } from '@archie-webapps/shared/ui/theme';

import cardPlaceholder from '../../../assets/card-placeholder.png';
import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { tableColumns } from '../../utils/table-fixtures/table-columns';
import { tableData } from '../../utils/table-fixtures/table-data';
import { ButtonOutline } from '../button/button.styled';
import { Table } from '../table/table';
import { TitleS, BodyM, BodyS } from '../typography/typography.styled';

import { CardProps, Card } from './card.styled';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta;

export const Small: Story<CardProps> = (props) => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Card" subtitle="small" />
    <Card {...props}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <TitleS>This is a small card</TitleS>
        <BodyM>It is typically used in a dashboard grid</BodyM>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
          <ButtonOutline small>View more</ButtonOutline>
          <ButtonOutline small isDisabled>
            Redeem
          </ButtonOutline>
        </div>
      </div>
    </Card>
  </StoriesContainer>
);

Small.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '420px',
  padding: '2rem 1.5rem',
  mobileRow: false,
  columnReverse: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
  backgroundImage: '',
};

export const FullWidth: Story<CardProps> = (props) => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Card" subtitle="full width" />
    <Card {...props}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <TitleS>This is a full-width card</TitleS>
        <BodyM>It wraps a table and some buttons</BodyM>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0 2rem' }}>
          <ButtonOutline small>View more</ButtonOutline>
          <ButtonOutline small isDisabled>
            Redeem
          </ButtonOutline>
        </div>
        <Table columns={tableColumns} data={tableData} />
      </div>
    </Card>
  </StoriesContainer>
);

FullWidth.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '100%',
  padding: '2rem 1.5rem 2.5rem',
  mobileRow: false,
  columnReverse: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
  backgroundImage: '',
};

export const WithBackgroundImage: Story<CardProps> = (props) => (
  <StoriesContainer bgColor={theme.backgroundSecondary}>
    <StoriesTitle title="Card" subtitle="with background image" />
    <Card {...props}>
      <div style={{ minHeight: '264px', padding: '6rem 1.5rem' }}>
        <BodyS weight={700} color={theme.textSecondary}>
          You can add whatever you want here
        </BodyS>
      </div>
    </Card>
  </StoriesContainer>
);

WithBackgroundImage.args = {
  column: false,
  alignItems: '',
  justifyContent: '',
  maxWidth: '420px',
  padding: '',
  mobileRow: false,
  columnReverse: false,
  mobileJustifyContent: '',
  mobileAlignItems: '',
  backgroundImage: cardPlaceholder,
};
