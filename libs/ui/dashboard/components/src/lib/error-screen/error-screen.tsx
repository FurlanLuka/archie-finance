import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import { Card, Error } from '@archie/ui/shared/ui/design-system';

import { ErrorScreenStyled } from './error-screen.styled';

interface State {
  prevPath?: string;
  description?: string;
}

export const ErrorScreen: FC = () => {
  const location = useLocation();
  const state = location.state as State;

  return (
    <ErrorScreenStyled>
      <Card
        justifyContent="center"
        maxWidth="800px"
        padding="2.5rem 1.5rem 3rem"
      >
        <Error prevPath={state?.prevPath} description={state?.description} />
      </Card>
    </ErrorScreenStyled>
  );
};
