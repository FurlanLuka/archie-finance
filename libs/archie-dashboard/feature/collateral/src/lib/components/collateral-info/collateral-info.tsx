import BigNumber from 'bignumber.js';
import { FC, useMemo } from 'react';

import { CollateralAssets, CollateralCurrency, LTVStatus } from '@archie-webapps/shared/constants';
import { CreditLine } from '@archie-webapps/shared/data-access/archie-api/credit_line/api/get-credit-line';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';
import { Table } from '@archie-webapps/shared/ui/design-system';

import { tableColumns } from '../../fixtures/table-fixtures';
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
  ledger: Ledger;
  creditLine: CreditLine;
  ltvStatus: LTVStatus;
}

export const CollateralInfo: FC<CollateralInfoProps> = ({ ledger, creditLine, ltvStatus }) => {
  const columns = useMemo(() => tableColumns, []);
  const isInMarginCall = ltvStatus === LTVStatus.MARGIN_CALL;

  const assetMap: AssetMap = useMemo(() => {
    return ledger.accounts.reduce((previousValue, ledgerAccount) => {
      const creditLimitAssetAllocation = creditLine.creditLimitAssetAllocation.find((item) => {
        item.assetId = ledgerAccount.assetId;
      });

      return {
        ...previousValue,
        [ledgerAccount.assetId]: {
          collateral_asset: ledgerAccount.assetId,
          balance: `$${ledgerAccount.accountValue}`,
          holdings: `${ledgerAccount.assetAmount} ${ledgerAccount.assetId}`,
          credit_limit: `${creditLimitAssetAllocation?.allocationPercentage ?? 0}%`,
          change: {
            collateral_asset: ledgerAccount.assetId,
          },
          allocation: BigNumber(ledgerAccount.accountValue).dividedBy(ledger.value).multipliedBy(100),
          actions: {
            collateral_asset: ledgerAccount.assetId,
            isHolding: true,
            isInMarginCall,
          },
        },
      };
    }, {} as AssetMap);
  }, [creditLine, ledger]);

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
