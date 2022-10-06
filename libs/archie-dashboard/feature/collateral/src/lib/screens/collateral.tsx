import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { MarginCallAlert } from '@archie-webapps/archie-dashboard/components';
import { calculateCollateralTotalValue, getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { LTVText, LTVColor } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { CreditLineResponse } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit-line';
import { useGetCreditLine } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit-line';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Card, Loader, Badge, TitleM, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralInfo } from '../components/collateral-info/collateral-info';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralValueResponse: QueryResponse<CollateralValue[]> = useGetCollateralValue();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();
  const getCreditLine: QueryResponse<CreditLineResponse> = useGetCreditLine();

  const getContent = () => {
    // TODO: Think of optimizing these
    if (
      getCollateralValueResponse.state === RequestState.LOADING ||
      getLTVResponse.state === RequestState.LOADING ||
      getCreditLine.state === RequestState.LOADING
    ) {
      return <Loader marginAuto />;
    }

    if (
      getCollateralValueResponse.state === RequestState.ERROR ||
      getLTVResponse.state === RequestState.ERROR ||
      getCreditLine.state === RequestState.ERROR
    ) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (
      getCollateralValueResponse.state === RequestState.SUCCESS &&
      getLTVResponse.state === RequestState.SUCCESS &&
      getCreditLine.state === RequestState.SUCCESS
    ) {
      const ltvData = getLTVResponse.data;
      const creditLineData = getCreditLine.data;

      return (
        <>
          <div className="subtitle-group">
            <TitleS className="subtitle">{t('dashboard_collateral.subtitle')}</TitleS>
            <TitleM weight={400} className="total">
              ${getFormattedValue(calculateCollateralTotalValue(getCollateralValueResponse.data))}
            </TitleM>
            <div className="ltv">
              <div className="ltv-group">
                <BodyM weight={700} color={theme.textSecondary}>
                  {t('ltv')}:
                </BodyM>
                <TitleS weight={400}>{ltvData.ltv.toFixed(2)}%</TitleS>
              </div>
              <Badge statusColor={LTVColor[ltvData.status]}>{LTVText[ltvData.status]}</Badge>
            </div>
          </div>
          <CollateralInfo
            collateral={getCollateralValueResponse.data}
            assetLimits={creditLineData.assetLimits}
            ltvStatus={ltvData.status}
          />
        </>
      );
    }

    return null;
  };

  return (
    <CollateralStyled>
      <MarginCallAlert />
      <TitleM className="title">{t('dashboard_collateral.title')}</TitleM>
      <Card column alignItems="center" padding="1.5rem 1.5rem 2rem" minHeight="528px">
        {getContent()}
      </Card>
    </CollateralStyled>
  );
};
