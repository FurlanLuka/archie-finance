import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Navigate } from 'react-router-dom';

import { CollateralValueChart } from '@archie-webapps/archie-dashboard/components';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, Card, Skeleton, TitleM, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

export const CollateralValue: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  if (getCollateralTotalValueResponse.state === RequestState.LOADING) {
    return (
      <Card>
        <Skeleton />
      </Card>
    );
  }

  if (getCollateralTotalValueResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/home' }} />;
  }

  if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
    const collateralTotalValue = getCollateralTotalValueResponse.data.value;

    return (
      <Card column alignItems="flex-start" justifyContent="space-between" padding="1.5rem">
        <div>
          <BodyM weight={700} className="card-title">
            {t('collateral_value_card.title')}
          </BodyM>
          <div className="text-group card-info">
            <TitleM weight={400}>${getFormattedValue(collateralTotalValue)}</TitleM>
            {/* <BodyM weight={500} color={theme.textSuccess}>
            ↑
          </BodyM> */}
          </div>
        </div>
        {/* <CollateralValueChart /> */}
        <div className="btn-group">
          <ButtonOutline small onClick={() => navigate('/collateral')}>
            {t('btn_add')}
          </ButtonOutline>
          <ButtonOutline small isDisabled>
            {t('btn_redeem')}
          </ButtonOutline>
        </div>
      </Card>
    );
  }

  return <></>;
};
