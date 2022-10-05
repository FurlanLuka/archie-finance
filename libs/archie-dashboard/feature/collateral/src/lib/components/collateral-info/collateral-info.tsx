import { FC, useMemo } from 'react';

import { calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAssets, CollateralCurrency, LTVStatus } from '@archie-webapps/shared/constants';
import { AssetLimits } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit-line';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { Table } from '@archie-webapps/shared/ui/design-system';

import { tableColumns } from '../../fixtures/table-fixture';
import { AssetsAllocation } from '../assets-allocation/assets-allocation';

type AssetMap = Record<
  CollateralCurrency,
  {
    collateral_asset: string;
    balance: string;
    holdings: string;
    change: {
      collateral_asset: string;
    };
    allocation: number;
    actions: {
      collateral_asset: string;
      isHolding: boolean;
    };
  }
>;

interface CollateralInfoProps {
  collateral: CollateralValue[];
  assetLimits: AssetLimits[];
  ltvStatus: LTVStatus;
}

export const CollateralInfo: FC<CollateralInfoProps> = ({ collateral, assetLimits, ltvStatus }) => {
  const totalValue = calculateCollateralTotalValue(collateral);
  const columns = useMemo(() => tableColumns, []);
  const isInMarginCall = ltvStatus === LTVStatus.MARGIN_CALL;

  const assetMap: AssetMap = useMemo(() => {
    return collateral.reduce(
      (map, item) => ({
        ...map,
        [item.asset]: {
          collateral_asset: item.asset,
          balance: `$${getFormattedValue(item.price)}`,
          holdings: `${item.assetAmount} ${item.asset}`,
          credit_limit: `$${getFormattedValue(assetLimits.find((i) => i.asset === item.asset)?.limit ?? 0)}`,
          change: {
            collateral_asset: item.asset,
          },
          allocation: (item.price / totalValue) * 100,
          actions: {
            collateral_asset: item.asset,
            isHolding: true,
            isInMarginCall,
          },
        },
      }),
      {} as AssetMap,
    );
  }, [collateral, totalValue]);

  const tableData = useMemo(() => {
    const notAddedAssets = Object.values(CollateralAssets).filter((asset) => assetMap[asset.id] === undefined);

    return Object.values(assetMap).concat(
      notAddedAssets.map((item) => ({
        collateral_asset: item.id,
        balance: '$0',
        holdings: `0 ${item.short}`,
        credit_limit: '$0',
        change: {
          collateral_asset: item.id,
        },
        allocation: 0,
        actions: {
          collateral_asset: item.id,
          isHolding: false,
          isInMarginCall,
        },
      })),
    );
  }, [assetMap]);

  return (
    <>
      <AssetsAllocation
        btc={assetMap[CollateralCurrency.BTC]?.allocation}
        eth={assetMap[CollateralCurrency.ETH]?.allocation}
        sol={assetMap[CollateralCurrency.SOL]?.allocation}
        usdc={assetMap[CollateralCurrency.USDC]?.allocation}
      />
      <Table columns={columns} data={tableData} />
    </>
  );
};
