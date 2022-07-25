import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SubtitleS } from '@archie-webapps/shared/ui/design-system';

import { HistoryStyled } from './history.styled';

export const HistoryScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <HistoryStyled>
      <SubtitleS className="title">History</SubtitleS>
    </HistoryStyled>
  );
};
