import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LoanToValueColor, LoanToValueText } from '@archie-webapps/archie-dashboard/constants';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralCurrency } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import {
  Loading,
  Card,
  Table,
  Badge,
  SubtitleS,
  ParagraphM,
  ParagraphXS,
} from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { AssetsAllocation } from '../components/assets-allocation/assets-allocation';
import { tableColumns } from '../fixtures/table-fixture';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getCollateralValueResponse: QueryResponse<CollateralValue[]> = useGetCollateralValue();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();

  const getAssetsAllocationPercentage = (price: number) => (price / getCollateralTotalValue()) * 100;

  const getCollateralTotalValue = () => {
    if (getCollateralValueResponse.state === RequestState.SUCCESS) {
      return getCollateralValueResponse.data.reduce((sum, item) => sum + item.price, 0);
    }

    return 0;
  };

  const getLTV = () => {
    if (getLTVResponse.state === RequestState.SUCCESS) {
      console.log(getLTVResponse.data);
      return getLTVResponse.data.ltv;
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

  if (getCollateralValueResponse.state === RequestState.LOADING || getLTVResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

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
            <ParagraphM>{getLTV()}%</ParagraphM>
          </div>
          <Badge statusColor={LoanToValueColor['good']}>{LoanToValueText['good']}</Badge>
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
