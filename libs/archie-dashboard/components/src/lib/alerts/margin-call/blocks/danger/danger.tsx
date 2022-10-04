import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ButtonLight, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

interface DangerProps {
  withButton?: boolean;
}

export const Danger: FC<DangerProps> = ({ withButton }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <BodyL weight={800} color={theme.textLight}>
        {t('margin_call_alert.title')}
      </BodyL>
      <BodyM color={theme.textLight}>{t('margin_call_alert.text')}</BodyM>
      {withButton && (
        <ButtonLight color={theme.textDanger} onClick={() => navigate('/collateral')}>
          {t('margin_call_alert.btn')}
        </ButtonLight>
      )}
    </>
  );
};
