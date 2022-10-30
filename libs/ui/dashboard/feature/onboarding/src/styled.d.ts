/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components';
import { Theme } from '@archie/ui/shared/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
