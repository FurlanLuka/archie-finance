import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SubtitleS } from '@archie-webapps/shared/ui/design-system';

import { SettingsStyled } from './settings.styled';

export const SettingsScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <SettingsStyled>
      <SubtitleS className="title">Settings</SubtitleS>
    </SettingsStyled>
  );
};
