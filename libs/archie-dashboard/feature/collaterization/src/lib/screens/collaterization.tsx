import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { Card, Loader, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { CollaterizationForm } from '../components/collaterization-form';

import { CollaterizationStyled } from './collaterization.styled';

export const CollaterizationScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  function getContent() {
    if (getCollateralTotalValueResponse.state === RequestState.LOADING) {
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    }

    if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
      const collateralTotalValue = getCollateralTotalValueResponse.data.value;

      return (
        <>
          <ParagraphS className="subtitle">
            {t('dashboard_collaterization.subtitle', { collateralTotalValue: getFormattedValue(collateralTotalValue) })}
          </ParagraphS>
          <CollaterizationForm />
        </>
      );
    }

    return null;
  }

  return (
    <CollaterizationStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem" minHeight="720px">
        <ParagraphM weight={800} className="title">
          {t('dashboard_collaterization.title')}
        </ParagraphM>
        {getContent()}
      </Card>
    </CollaterizationStyled>
  );
};
