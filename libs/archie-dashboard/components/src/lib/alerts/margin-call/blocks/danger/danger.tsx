import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { ButtonLight, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

interface DangerProps {
  withButton?: boolean;
}

export const Danger: FC<DangerProps> = ({ withButton }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getLTVResponse: QueryResponse<LTV> = useGetLTV();

  if (getLTVResponse.state === RequestState.SUCCESS) {
    const ltvData = getLTVResponse.data;

    return (
      <>
        <BodyL weight={800} color={theme.textLight}>
          {t('margin_call_alert.title')}
        </BodyL>
        <BodyM color={theme.textLight}>{t('margin_call_alert.text_1', { ltv: ltvData.ltv.toFixed(2) })}</BodyM>
        <BodyM color={theme.textLight}>{t('margin_call_alert.text_2')}</BodyM>
        {withButton && (
          <ButtonLight color={theme.textDanger} onClick={() => navigate('/collateral')}>
            {t('margin_call_alert.btn')}
          </ButtonLight>
        )}
      </>
    );
  }

  return <></>;
};
