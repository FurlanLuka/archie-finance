import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ButtonLight, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

interface WarningProps {
  withButton?: boolean;
}

export const Warning: FC<WarningProps> = ({ withButton }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="content">
      <BodyL weight={800} color={theme.textLight}>
        {t('close_to_margin_call_alert.title')}
      </BodyL>
      <BodyM color={theme.textLight}>{t('close_to_margin_call_alert.text')}</BodyM>
      {withButton && (
        <ButtonLight color={theme.textWarning} onClick={() => navigate('/collateral')}>
          {t('close_to_margin_call_alert.btn')}
        </ButtonLight>
      )}
    </div>
  );
};
