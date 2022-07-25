import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-value';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-collateral-value';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { Loading, Card, Table, Badge, SubtitleS, ParagraphM, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';
import { CollateralCurrency } from '@archie-webapps/util-constants';
import { LoanToValueColor, LoanToValueText } from '@archie-webapps/util-constants';

import { AssetsAllocation } from '../components/assets-allocation/assets-allocation';
import { tableColumns } from '../fixtures/table-fixture';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralValueResponse: QueryResponse<CollateralValue[]> = useGetCollateralValue();

  const getFormattedValue = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const getAssetsAllocationPercentage = (price: number) => (price / getCollateralTotalValue()) * 100;

  const getCollateralTotalValue = () => {
    if (getCollateralValueResponse.state === RequestState.SUCCESS) {
      return getCollateralValueResponse.data.reduce((sum, item) => sum + item.price, 0);
    }

    return 0;
  };

  const getAssetsAllocation = (asset: string) => {
    if (getCollateralValueResponse.state === RequestState.SUCCESS) {
      const current = getCollateralValueResponse.data.find((item) => item.asset === asset);

      return getAssetsAllocationPercentage(current?.price ?? 0);
    }

    return 0;
  };

  const data = useMemo(() => {
    if (getCollateralValueResponse.state === RequestState.SUCCESS) {
      return getCollateralValueResponse.data.map((item) => ({
        collateral_asset: item.asset,
        balance: `$${getFormattedValue(item.price)}`,
        holdings: `${item.assetAmount} ${item.asset}`,
        change: {
          collateral_asset: item.asset,
        },
        allocation: getAssetsAllocationPercentage(item.price),
        actions: {
          collateral_asset: item.asset,
        },
      }));
    }

    return [];
  }, [getCollateralValueResponse]);

  const columns = useMemo(() => tableColumns, []);

  if (getCollateralValueResponse.state === RequestState.LOADING) {
    return <Loading />;
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
        <SubtitleS weight={400} className="total">
          ${getFormattedValue(getCollateralTotalValue())}
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

        <AssetsAllocation
          btc={getAssetsAllocation(CollateralCurrency.BTC)}
          eth={getAssetsAllocation(CollateralCurrency.ETH)}
          sol={getAssetsAllocation(CollateralCurrency.SOL)}
          usdc={getAssetsAllocation(CollateralCurrency.USDC)}
        />

        <Table columns={columns} data={data} />
      </Card>
    </CollateralStyled>
  );
};
