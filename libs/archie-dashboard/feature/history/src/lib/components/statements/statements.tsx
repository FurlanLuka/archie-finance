/* eslint-disable @typescript-eslint/no-empty-function */
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetStatements } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-statements';
import { ButtonPrimary, Loader, Select, SelectOption } from '@archie-webapps/shared/ui/design-system';

import { StatementsStyled } from './statements.styled';

export const Statements: FC = () => {
  const getStatementsResponse = useGetStatements();
  const { t } = useTranslation();

  function getContent() {
    if (getStatementsResponse.state === RequestState.LOADING) {
      // TODO make this prettier for loading, can probably be handled on select or something
      return (
        <>
          <Select id="accounts" disabled header={<Loader />} onChange={() => {}}>
            {[]}
          </Select>
          <ButtonPrimary isLoading>{t('dashboard_history.statements_download')}</ButtonPrimary>
        </>
      );
    }

    if (getStatementsResponse.state === RequestState.SUCCESS) {
      if (getStatementsResponse.data.length === 0) {
        return <div>{t('dashboard_history.no_statements')}</div>;
      }
    }

    return <></>;
  }
  const options = useMemo(() => {
    if (getStatementsResponse.state === RequestState.SUCCESS) {
      return getStatementsResponse.data.map((statement) => (
        <SelectOption key={statement.id} value={statement}>
          {statement.billingCycleStartDate} - {statement.billingCycleEndDate}
        </SelectOption>
      ));
    }
    return [];
  }, [getStatementsResponse]);

  return <StatementsStyled>{getContent()}</StatementsStyled>;
};
