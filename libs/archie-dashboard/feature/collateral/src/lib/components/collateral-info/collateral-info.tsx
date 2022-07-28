import { FC, useMemo } from 'react';

import { calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';
import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAssets, CollateralCurrency } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { Table } from '@archie-webapps/shared/ui/design-system';

import { tableColumns } from '../../fixtures/table-fixture';
import { AssetsAllocation } from '../assets-allocation/assets-allocation';
import { AddNewAsset } from '../add-new-asset/add-new-asset';

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
    };
  }
>;
interface CollateralInfoProps {
  collateral: CollateralValue[];
}
export const CollateralInfo: FC<CollateralInfoProps> = ({ collateral }) => {
  const totalValue = calculateCollateralTotalValue(collateral);

  const assetMap: AssetMap = useMemo(() => {
    return collateral.reduce(
      (map, item) => ({
        ...map,
        [item.asset]: {
          collateral_asset: item.asset,
          balance: `$${getFormattedValue(item.price)}`,
          holdings: `${item.assetAmount} ${item.asset}`,
          change: {
            collateral_asset: item.asset,
          },
          allocation: (item.price / totalValue) * 100,
          actions: {
            collateral_asset: item.asset,
          },
        },
      }),
      {} as AssetMap,
    );
  }, [collateral, totalValue]);

  const notAddedAssets = Object.values(CollateralAssets).filter((asset) => assetMap[asset.id] === undefined);

  return (
    <>
      <AssetsAllocation
        btc={assetMap[CollateralCurrency.BTC]?.allocation}
        eth={assetMap[CollateralCurrency.ETH]?.allocation}
        sol={assetMap[CollateralCurrency.SOL]?.allocation}
        usdc={assetMap[CollateralCurrency.USDC]?.allocation}
      />
      <Table columns={tableColumns} data={Object.values(assetMap)} />
      {notAddedAssets.length > 0 && <AddNewAsset assets={notAddedAssets} />}
    </>
  );
};
