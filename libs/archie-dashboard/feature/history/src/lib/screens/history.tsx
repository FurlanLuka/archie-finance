import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, ParagraphM } from '@archie-webapps/shared/ui/design-system';

import { RecentTransactions } from '../components/recent-transactions/recent-transactions';

import { HistoryStyled } from './history.styled';

export const HistoryScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <HistoryStyled>
      <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
        <ParagraphM weight={800} className="title">
          {t('dashboard_history.title')}
        </ParagraphM>
        <RecentTransactions />
      </Card>
    </HistoryStyled>
  );
};
