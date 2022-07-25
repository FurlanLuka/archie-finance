import { Loader } from '../loader/loader';

import { LoadingStyled } from './loading.styled';

export const Loading = () => (
  <LoadingStyled>
    <Loader className="loader" />
  </LoadingStyled>
);
