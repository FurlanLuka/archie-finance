import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { Card, Loader, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { CollateralizationForm } from '../components/collateralization-form';

import { CollateralizationStyled } from './collateralization.styled';

export const CollateralizationScreen: FC = () => {
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
            {t('dashboard_collateralization.subtitle', {
              collateralTotalValue: getFormattedValue(collateralTotalValue),
            })}
          </ParagraphS>
          <CollateralizationForm />
        </>
      );
    }

    return null;
  }

  return (
    <CollateralizationStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem" minHeight="720px">
        <ParagraphM weight={800} className="title">
          {t('dashboard_collateralization.title')}
        </ParagraphM>
        {getContent()}
      </Card>
    </CollateralizationStyled>
  );
};
