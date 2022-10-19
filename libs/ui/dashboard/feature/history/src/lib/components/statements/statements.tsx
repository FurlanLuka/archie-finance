/* eslint-disable @typescript-eslint/no-empty-function */
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetStatements } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-statements';
import {
  ButtonOutline,
  Select,
  BodyS,
} from '@archie/ui/shared/ui/design-system';
import { Icon } from '@archie/ui/shared/ui/icons';
import { theme } from '@archie/ui/shared/ui/theme';

import { StatementDownload } from './blocks/statement-download/statement-download';
import { StatementsStyled } from './statements.styled';

export const Statements: FC = () => {
  const { t } = useTranslation();
  const getStatementsResponse = useGetStatements();

  const getContent = () => {
    if (getStatementsResponse.state === RequestState.LOADING) {
      return (
        <>
          <Select
            id="statements"
            small
            width="220px"
            isDisabled
            header={
              <BodyS weight={600} color={theme.textDisabled}>
                {t('dashboard_history.fetch_statements')}
              </BodyS>
            }
            onChange={() => {}}
          >
            {[]}
          </Select>
          <ButtonOutline small width="175px" isLoading>
            {t('dashboard_history.btn_statements')}{' '}
            <Icon name="download" fill={theme.textDisabled} />
          </ButtonOutline>
        </>
      );
    }

    if (getStatementsResponse.state === RequestState.SUCCESS) {
      if (getStatementsResponse.data.length === 0) {
        return (
          <>
            <Select
              id="statements"
              small
              width="220px"
              isDisabled
              header={
                <BodyS weight={600} color={theme.textDisabled}>
                  {t('dashboard_history.no_statements')}
                </BodyS>
              }
              onChange={() => {}}
            >
              {[]}
            </Select>
            <ButtonOutline small width="175px" isDisabled>
              {t('dashboard_history.btn_statements')}{' '}
              <Icon name="download" fill={theme.textDisabled} />
            </ButtonOutline>
          </>
        );
      }

      return <StatementDownload statements={getStatementsResponse.data} />;
    }

    return <></>;
  };

  return <StatementsStyled>{getContent()}</StatementsStyled>;
};
