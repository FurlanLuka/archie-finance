import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { LoanToValueColor, LoanToValueText } from '@archie-webapps/archie-dashboard/constants';
import { calculateCollateralTotalValue, getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Card, Loader, Badge, SubtitleS, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralInfo } from '../components/collateral-info/collateral-info';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralValueResponse: QueryResponse<CollateralValue[]> = useGetCollateralValue();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();

  const getContent = () => {
    if (getCollateralValueResponse.state === RequestState.LOADING || getLTVResponse.state === RequestState.LOADING) {
      return <Loader />;
    }

    if (getCollateralValueResponse.state === RequestState.ERROR || getLTVResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (getCollateralValueResponse.state === RequestState.SUCCESS && getLTVResponse.state === RequestState.SUCCESS) {
      const ltvData = getLTVResponse.data;

      return (
        <>
          <div className="title-group">
            <ParagraphM weight={800} className="title">
              {t('dashboard_collateral.title')}
            </ParagraphM>
            <SubtitleS weight={400} className="total">
              ${getFormattedValue(calculateCollateralTotalValue(getCollateralValueResponse.data))}
            </SubtitleS>
            <div className="ltv">
              <div className="ltv-group">
                <ParagraphXS weight={700} color={theme.textSecondary}>
                  {t('ltv')}:
                </ParagraphXS>
                <ParagraphM>{ltvData.ltv.toFixed(2)}%</ParagraphM>
              </div>
              <Badge statusColor={LoanToValueColor[ltvData.status]}>{LoanToValueText[ltvData.status]}</Badge>
            </div>
          </div>
          <CollateralInfo collateral={getCollateralValueResponse.data} />
        </>
      );
    }

    return null;
  };

  return (
    <CollateralStyled>
      <Card column alignItems="center" justifyContent="center" padding="2rem 1.5rem 2.5rem" minHeight="560px">
        {getContent()}
      </Card>
    </CollateralStyled>
  );
};
