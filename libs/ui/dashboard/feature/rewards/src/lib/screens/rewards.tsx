import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TitleM } from '@archie/ui/shared/design-system';

import { RewardsStyled } from './rewards.styled';

export const RewardsScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <RewardsStyled>
      <TitleM className="title">Rewards</TitleM>
    </RewardsStyled>
  );
};
