import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TitleM } from '@archie-webapps/shared/ui/design-system';

import { SettingsStyled } from './settings.styled';

export const SettingsScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <SettingsStyled>
      <TitleM className="title">Settings</TitleM>
    </SettingsStyled>
  );
};
