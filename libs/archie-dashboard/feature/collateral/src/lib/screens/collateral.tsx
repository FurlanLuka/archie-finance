import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LoanToValueColor, LoanToValueText } from '@archie-webapps/archie-dashboard/constants';
import { calculateCollateralTotalValue, getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Loading, Card, Badge, SubtitleS, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralInfo } from '../components/collateral-info/collateral-info';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralValueResponse: QueryResponse<CollateralValue[]> = useGetCollateralValue();

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

  // Temp data
  const ltv = 22;
  const good = 'good';

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
            <ParagraphM>{ltv}%</ParagraphM>
          </div>
          <Badge statusColor={LoanToValueColor[good]}>{LoanToValueText[good]}</Badge>
        </div>
        {getContent()}
      </Card>
    </CollateralStyled>
  );
};
