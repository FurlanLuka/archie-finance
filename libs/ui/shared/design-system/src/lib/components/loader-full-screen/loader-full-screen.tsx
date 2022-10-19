import { theme } from '@archie/ui/shared/theme';

import { Loader } from '../loader/loader';

import { LoaderFullScreenStyled } from './loader-full-screen.styled';

export const LoaderFullScreen = () => (
  <LoaderFullScreenStyled>
    <Loader color={theme.backgroundPrimary} />
  </LoaderFullScreenStyled>
);