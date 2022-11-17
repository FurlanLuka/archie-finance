import { theme } from '@archie/ui/shared/theme';

import { Loader } from '../loader/loader.styled';

import { LoaderFullScreenStyled } from './loader-full-screen.styled';

export const LoaderFullScreen = () => (
  <LoaderFullScreenStyled>
    {/* Let's find smth better here */}
    <Loader color={theme.backgroundPrimary} />
  </LoaderFullScreenStyled>
);
