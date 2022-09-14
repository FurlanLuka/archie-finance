/* eslint-disable @typescript-eslint/no-empty-function */
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetStatements } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-statements';
import { ButtonOutline, Loader, Select } from '@archie-webapps/shared/ui/design-system';

import { StatementDownload } from './blocks/statement-download/statement-download';
import { StatementsStyled } from './statements.styled';

export const Statements: FC = () => {
  const { t } = useTranslation();
  const getStatementsResponse = useGetStatements();

  const getContent = () => {
    if (getStatementsResponse.state === RequestState.LOADING) {
      return (
        <>
          <Select id="statements" small minWidth="240px" isDisabled header={<Loader />} onChange={() => {}}>
            {[]}
          </Select>
          <ButtonOutline small maxWidth="175px" isLoading>
            {t('dashboard_history.statements_download')}
          </ButtonOutline>
        </>
      );
    }

    if (getStatementsResponse.state === RequestState.SUCCESS) {
      if (getStatementsResponse.data.length === 0) {
        return <div>{t('dashboard_history.no_statements')}</div>;
      }

      return <StatementDownload statements={getStatementsResponse.data} />;
    }

    return <></>;
  };

  return <StatementsStyled>{getContent()}</StatementsStyled>;
};
