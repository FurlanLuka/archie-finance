import { useTheme } from 'styled-components';

import { Loader } from '../loader/loader';

import { LoadingStyled } from './loading.styled';

export const Loading = () => {
  const { backgroundPrimary } = useTheme();

  return (
    <LoadingStyled>
      <Loader color={backgroundPrimary} />
    </LoadingStyled>
  );
};
