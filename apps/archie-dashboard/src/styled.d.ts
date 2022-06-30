/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components';
import { Theme } from '@archie-webapps/ui-theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
