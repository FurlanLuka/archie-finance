/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components';
import { Theme } from '@archie-microservices/ui/shared/ui/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
