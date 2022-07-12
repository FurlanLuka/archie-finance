import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

import logo from './logo.png'

addons.setConfig({
  showAddonsPanel: true,
  panelPosition: 'bottom',
  theme: create({
    base: 'light',
    brandTitle: 'Archie Finance',
    brandImage: logo,
  }),
});
