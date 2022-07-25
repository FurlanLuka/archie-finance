import { theme } from '@archie-webapps/ui-theme';

import { Loader } from '../loader/loader';

import { LoadingStyled } from './loading.styled';

export const Loading = () => {
  return (
    <LoadingStyled>
      <Loader color={theme.backgroundPrimary} />
    </LoadingStyled>
  );
};
