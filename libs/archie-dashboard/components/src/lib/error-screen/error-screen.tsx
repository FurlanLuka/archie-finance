import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Card, Error } from '@archie-webapps/shared/ui/design-system';

import { ErrorScreenStyled } from './error-screen.styled';

export const ErrorScreen: FC = () => {
  const { state } = useLocation();

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <ErrorScreenStyled>
      <Card justifyContent="center" maxWidth="800px" padding="2.5rem 1.5rem 3rem">
        <Error />
      </Card>
    </ErrorScreenStyled>
  );
};
