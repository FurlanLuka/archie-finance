import { Story, Meta } from '@storybook/react';
import { Key } from 'react';

import { theme } from '@archie-microservices/ui/shared/ui/theme';

import { StoriesContainer } from '../../utils/stories-container/stories-container';
import { StoriesTitle } from '../../utils/stories-title/stories-title';
import { BodyS } from '../typography/typography.styled';

export default {
  title: 'Theme/Colors',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta;

const colors = [
  { name: 'Black', value: '#081517' },
  { name: 'White', value: '#fff' },
  { name: 'Neutralgray 800', value: '#263133' },
  { name: 'Neutralgray 700', value: '#444e50' },
  { name: 'Neutralgray 600', value: '#626a6c' },
  { name: 'Neutralgray 500', value: '#818788' },
  { name: 'Neutralgray 400', value: '#9fa3a4' },
  { name: 'Neutralgray 300', value: '#bdc0c1' },
  { name: 'Neutralgray 200', value: '#dbdcdd' },
  { name: 'Neutralgray 100', value: '#f9f9f9' },
  { name: 'Coral 800', value: '#46312f' },
  { name: 'Coral 700', value: '#844d47' },
  { name: 'Coral 600', value: '#c1695f' },
  { name: 'Coral 500', value: '#ff8577' },
  { name: 'Coral 400', value: '#fea298' },
  { name: 'Coral 300', value: '#fcbfb8' },
  { name: 'Coral 200', value: '#fbdcd9' },
  { name: 'Teal 800', value: '#24464b' },
  { name: 'Teal 700', value: '#40777f' },
  { name: 'Teal 600', value: '#5ca8b3' },
  { name: 'Teal 500', value: '#70d1df' },
  { name: 'Teal 400', value: '#98e1ec' },
  { name: 'Teal 300', value: '#b9e9f0' },
  { name: 'Teal 200', value: '#d9f1f4' },
  { name: 'Green 600', value: '#00c853' },
  { name: 'Green 500', value: '#00e676' },
  { name: 'Green 400', value: '#69f0ae' },
  { name: 'Yellow 600', value: '#ffd600' },
  { name: 'Yellow 500', value: '#ffea00' },
  { name: 'Yellow 400', value: '#ffff8d' },
  { name: 'Orange 600', value: '#ff6d00' },
  { name: 'Orange 500', value: '#ff9100' },
  { name: 'Orange 400', value: '#ffd180' },
  { name: 'Red 600', value: '#d50000' },
  { name: 'Red 500', value: '#ff1744' },
  { name: 'Red 400', value: '#ff8a80' },
  { name: 'Transparent', value: 'transparent' },
];

export const Default: Story = () => (
  <StoriesContainer>
    <StoriesTitle title="Colors" />
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '32px',
        maxWidth: '60%',
        margin: '0 auto',
      }}
    >
      {colors.map((item: { name: string; value: string }, index: Key) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            textAlign: 'center',
            width: '25%',
          }}
        >
          <div
            style={{
              backgroundColor: item.value,
              width: '98px',
              height: '98px',
              border: `1px solid ${theme.borderPrimary}`,
              borderRadius: '8px',
            }}
          />
          <div>
            <BodyS weight={700}>{item.name}</BodyS>
            <BodyS color={theme.textSecondary}>{item.value}</BodyS>
          </div>
        </div>
      ))}
    </div>
  </StoriesContainer>
);
