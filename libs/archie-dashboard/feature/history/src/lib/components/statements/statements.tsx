import { FC } from 'react';

import { useGetStatements } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-statements';

export const Statements: FC = () => {
  const getStatementsResponse = useGetStatements();

  return null;
};
