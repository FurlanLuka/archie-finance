import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TotalCollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-collateral-total-value';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { Card, Table, Badge, SubtitleS, ParagraphM, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';
import { LoanToValueColor, LoanToValueText } from '@archie-webapps/util-constants';

import { AssetsAllocation } from '../components/assets-allocation/assets-allocation';
import { tableData } from '../constants/table-data';
import { tableColumns } from '../fixtures/table-fixture';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  const getCollateralTotalValue = () => {
    if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
      return getCollateralTotalValueResponse.data.value;
    }

    return 0;
  };

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

  // Temp data
  const ltv = 22;
  const good = 'good';

  return (
    <CollateralStyled>
      <div className="section-table">
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
          <ParagraphM weight={800} className="title">
            {t('dashboard_collateral.table_section.title')}
          </ParagraphM>
          <SubtitleS weight={400} className="total">
            ${getCollateralTotalValue()}
          </SubtitleS>
          <div className="title-group">
            <div className="ltv-group">
              <ParagraphXS weight={700} color={theme.textSecondary}>
                {t('ltv')}:
              </ParagraphXS>
              <ParagraphM>{ltv}%</ParagraphM>
            </div>
            <Badge statusColor={LoanToValueColor[good]}>{LoanToValueText[good]}</Badge>
          </div>

          <AssetsAllocation />

          <Table columns={columns} data={data} />
        </Card>
      </div>
    </CollateralStyled>
  );
};
