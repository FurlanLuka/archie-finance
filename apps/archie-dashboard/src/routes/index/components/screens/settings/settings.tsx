import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SubtitleS } from '@archie-webapps/ui-design-system';

import { SettingsStyled } from './settings.styled';

export const Settings: FC = () => {
  const { t } = useTranslation();

  return (
    <SettingsStyled>
      <SubtitleS className="title">Settings</SubtitleS>
    </SettingsStyled>
  );
};
