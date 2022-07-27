import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { calculateCollateralTotalValue, getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { Card, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { CollaterizationStyled } from './collaterization.styled';
import { useParams } from 'react-router-dom';
import { CollateralizationRouteParams } from '../interfaces/routing';
import { AddCollateral } from '../components/add-collateral/add-collateral';
import { CollateralDeposit } from '../components/collateral-updated/collateral-updated';

export const CollaterizationScreen: FC = () => {
  const { t } = useTranslation();
  const { asset } = useParams<CollateralizationRouteParams>();

  const getCollateralValueResponse = useGetCollateralValue();

  function getContent() {
    if (getCollateralValueResponse.state === RequestState.LOADING) {
      return <ParagraphS className="subtitle">{t('dashboard_collaterization.subtitle_loading')}</ParagraphS>;
    }

    if (getCollateralValueResponse.state === RequestState.SUCCESS) {
      const collateralTotalValue = calculateCollateralTotalValue(getCollateralValueResponse.data);

      return (
        <>
          <ParagraphS className="subtitle">
            {t('dashboard_collaterization.subtitle', { collateralTotalValue: getFormattedValue(collateralTotalValue) })}
          </ParagraphS>
          <CollateralDeposit initialCollateral={getCollateralValueResponse.data} />
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
        {getContent()}
        <AddCollateral />
      </Card>
    </CollaterizationStyled>
  );
};
