import { FC } from 'react';

import { Card, Error } from '@archie-webapps/shared/ui/design-system';

import { ErrorScreenStyled } from './error-screen.styled';

export const ErrorScreen: FC = () => (
  <ErrorScreenStyled>
    <Card justifyContent="center" maxWidth="800px" padding="2.5rem 1.5rem 3rem">
      <Error />
    </Card>
  </ErrorScreenStyled>
);
