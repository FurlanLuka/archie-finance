import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { Card, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { CollaterizationStyled } from './collaterization.styled';
import { useParams } from 'react-router-dom';
import { CollateralizationRouteParams } from '../interfaces/routing';
import { AddCollateral } from '../components/add-collateral/add-collateral';

export const CollaterizationScreen: FC = () => {
  const { t } = useTranslation();
  const { asset } = useParams<CollateralizationRouteParams>();

  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  function getSubtitle() {
    if (getCollateralTotalValueResponse.state === RequestState.LOADING) {
      return <ParagraphS className="subtitle">{t('dashboard_collaterization.subtitle_loading')}</ParagraphS>;
    }

    if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
      const collateralTotalValue = getCollateralTotalValueResponse.data.value;

      return (
        <>
          <ParagraphS className="subtitle">
            {t('dashboard_collaterization.subtitle', { collateralTotalValue: getFormattedValue(collateralTotalValue) })}
          </ParagraphS>
        </>
      );
    }

    return null;
  }

  return (
    <CollaterizationStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem" minHeight="720px">
        <ParagraphM weight={800} className="title">
          {t('dashboard_collaterization.title', { asset })}
        </ParagraphM>
        {getSubtitle()}
        <AddCollateral />
      </Card>
    </CollaterizationStyled>
  );
};
