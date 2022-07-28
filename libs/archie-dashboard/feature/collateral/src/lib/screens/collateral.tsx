import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LoanToValueStatus, LoanToValueColor, LoanToValueText } from '@archie-webapps/archie-dashboard/constants';
import { calculateCollateralTotalValue, getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Loading, Card, Badge, SubtitleS, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralInfo } from '../components/collateral-info/collateral-info';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralValueResponse: QueryResponse<CollateralValue[]> = useGetCollateralValue();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();

  // TODO display loader if ltv or this is loading
  function getContent() {
    switch (getCollateralValueResponse.state) {
      case RequestState.ERROR:
        return <div>Something went wrong :(</div>;
      case RequestState.LOADING:
      case RequestState.IDLE:
        return <Loading />;
      case RequestState.SUCCESS:
        return <CollateralInfo collateral={getCollateralValueResponse.data} />;
    }
  }
  const getLTV = () => {
    if (getLTVResponse.state === RequestState.SUCCESS) {
      return getLTVResponse.data;
    }

    return { ltv: 0, status: LoanToValueStatus.GOOD };
  };

  return (
    <CollateralStyled>
      <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
        <ParagraphM weight={800} className="title">
          {t('dashboard_collateral.title')}
        </ParagraphM>
        {getCollateralValueResponse.state === RequestState.SUCCESS && (
          <SubtitleS weight={400} className="total">
            ${getFormattedValue(calculateCollateralTotalValue(getCollateralValueResponse.data))}
          </SubtitleS>
        )}
        <div className="title-group">
          <div className="ltv-group">
            <ParagraphXS weight={700} color={theme.textSecondary}>
              {t('ltv')}:
            </ParagraphXS>
            <ParagraphM>{getLTV().ltv.toFixed(2)}%</ParagraphM>
          </div>
          <Badge statusColor={LoanToValueColor[getLTV().status]}>{LoanToValueText[getLTV().status]}</Badge>
        </div>
        {getContent()}
      </Card>
    </CollateralStyled>
  );
};
