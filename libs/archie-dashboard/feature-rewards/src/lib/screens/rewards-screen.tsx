import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SubtitleS } from '@archie-webapps/ui-design-system';

import { RewardsStyled } from './rewards-screen.styled';

export const RewardsScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <RewardsStyled>
      <SubtitleS className="title">Rewards</SubtitleS>
    </RewardsStyled>
  );
};
