import { FC, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { DepositAddress } from '@archie-webapps/archie-dashboard/components';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { AssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/api/get-asset-price';
import { Table } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { tableColumns } from './fixtures/table-fixtures';
import { CollaterizationFormStyled } from './collaterization-form.styled';

interface CollateralizationFormProps {
  assetInfo: CollateralAsset;
  assetPrice: AssetPrice;
  currentLtv: number;
  minCollateral: number;
}

export const CollateralizationForm: FC<CollateralizationFormProps> = ({
  assetInfo,
  assetPrice,
  currentLtv,
  minCollateral,
}) => {
  const [requiredCollateral, setRequiredCollateral] = useState(0);

  useEffect(() => {
    const price = 1 / assetPrice.price;
    const result = (minCollateral / (assetInfo.loan_to_value / 100)) * price;

    setRequiredCollateral(Math.ceil(result * 10000) / 10000);
  }, [minCollateral, assetPrice]);

  const tableData = [
    {
      target_ltv: '50%',
      asset_to_add: {
        amount: requiredCollateral,
        asset: assetInfo.short,
      },
      info: {
        text: 'Suggested',
        color: theme.textSuccess,
      },
    },
    {
      target_ltv: '74%',
      asset_to_add: {
        amount: requiredCollateral,
        asset: assetInfo.short,
      },
      info: {
        text: 'Minimum',
        color: theme.textDanger,
      },
    },
    {
      target_ltv: '50%',
      asset_to_add: {
        amount: requiredCollateral,
        asset: assetInfo.short,
      },
      info: {
        text: 'Calculate target LTV',
        color: theme.textPrimary,
      },
    },
  ];

  return (
    <CollaterizationFormStyled>
      <div className="ltv-info">
        <Table columns={tableColumns} data={tableData} />
      </div>
      <DepositAddress assetInfo={assetInfo} />
    </CollaterizationFormStyled>
  );
};
