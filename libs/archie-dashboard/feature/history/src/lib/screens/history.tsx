import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, SubtitleS } from '@archie-webapps/shared/ui/design-system';

import { TransactionsTable } from '../components/transactions-table/transactions-table';

import { HistoryStyled } from './history.styled';

export const HistoryScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <HistoryStyled>
      <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
        <SubtitleS className="title">{t('dashboard_history.title')}</SubtitleS>
        <TransactionsTable />
      </Card>
    </HistoryStyled>
  );
};
