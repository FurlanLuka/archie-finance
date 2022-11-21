import { FC, useMemo } from 'react';

import { CreditLine } from '@archie/api/credit-line-api/data-transfer-objects/types';
import { Ledger } from '@archie/api/ledger-api/data-transfer-objects/types';
import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import {
  CollateralAsset,
  CollateralAssets,
  CollateralCurrency,
} from '@archie/ui/shared/constants';
import { Table } from '@archie/ui/shared/design-system';

import { tableColumns } from '../../fixtures/table-fixtures';
import { AssetValue } from '../../fixtures/table-fixtures.interfaces';
import { AssetsAllocation } from '../assets-allocation/assets-allocation';

type AssetMap = Record<CollateralCurrency, AssetValue>;

interface CollateralInfoProps {
  ledger: Ledger;
  creditLine: CreditLine;
  ltvStatus: LtvStatus;
}

export const CollateralInfo: FC<CollateralInfoProps> = ({
  ledger,
  creditLine,
  ltvStatus,
}) => {
  const columns = useMemo(() => tableColumns, []);
  const isInMarginCall = ltvStatus === LtvStatus.margin_call;

  const assetMap: AssetMap = useMemo(() => {
    return ledger.accounts.reduce(
      (previousValue: AssetMap, ledgerAccount): AssetMap => {
        if (Number(ledgerAccount.assetAmount) === 0) {
          return previousValue;
        }

        const creditLimitAssetAllocation =
          creditLine.creditLimitAssetAllocation.find(
            (item) => item.assetId === ledgerAccount.assetId,
          );

        return {
          ...previousValue,
          [ledgerAccount.assetId]: {
            collateralAsset: ledgerAccount.assetId,
            balance: `$${ledgerAccount.accountValue}`,
            holdings: `${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`,
            change: {
              collateralAsset: ledgerAccount.assetId,
            },
            allocation: creditLimitAssetAllocation?.allocationPercentage ?? 0,
            actions: {
              collateralAsset: ledgerAccount.assetId,
              isHolding: true,
              isInMarginCall,
            },
          },
        };
      },
      {} as AssetMap,
    );
  }, [creditLine, isInMarginCall, ledger.accounts]);

  const tableData: AssetValue[] = useMemo(() => {
    const notAddedAssets: CollateralAsset[] = Object.values(
      CollateralAssets,
    ).filter((asset) => assetMap[asset.id] === undefined);

    return Object.values(assetMap).concat(
      notAddedAssets.map((item) => ({
        collateralAsset: item.id,
        balance: '$0',
        holdings: `0 ${item.short}`,
        change: {
          collateralAsset: item.id,
        },
        allocation: 0,
        actions: {
          collateralAsset: item.id,
          isHolding: false,
          isInMarginCall,
        },
      })),
    );
  }, [assetMap, isInMarginCall]);

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
