import { FC, useState, useMemo } from 'react';

import { DepositAddress } from '@archie-webapps/archie-dashboard/components';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { MINIMUM_LTV, SUGGESTED_LTV } from '@archie-webapps/archie-dashboard/constants';
import { calculateCollateralValue } from '@archie-webapps/archie-dashboard/utils';
import { Table, InputText } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { tableColumns } from './fixtures/table-fixtures';
import { CollaterizationFormStyled } from './collaterization-form.styled';

interface CollateralizationFormProps {
  assetInfo: CollateralAsset;
  assetPrice: number;
  creditBalance: number;
  collateralTotalValue: number;
}

// TODO rename to margin call something something
export const CollateralizationForm: FC<CollateralizationFormProps> = ({
  assetInfo,
  assetPrice,
  creditBalance,
  collateralTotalValue,
}) => {
  const [customLtv, setCustomLtv] = useState(SUGGESTED_LTV);

  const getRequiredCollateral = (targetLtv: number) => {
    const collateral = calculateCollateralValue(targetLtv, creditBalance, collateralTotalValue);

    const price = 1 / assetPrice;
    const result = (collateral / (assetInfo.loan_to_value / 100)) * price;

    return Math.ceil(result * 10000) / 10000;
  };

  const tableData = useMemo(() => {
    return [
      {
        target_ltv: `${SUGGESTED_LTV}%`,
        asset_to_add: {
          id: 'suggested_collateral',
          amount: getRequiredCollateral(SUGGESTED_LTV),
          asset: assetInfo.short,
        },
        info: {
          text: 'Suggested',
          color: theme.textSuccess,
        },
      },
      {
        target_ltv: `${MINIMUM_LTV}%`,
        asset_to_add: {
          id: 'minimum_collateral',
          amount: getRequiredCollateral(MINIMUM_LTV),
          asset: assetInfo.short,
        },
        info: {
          text: 'Minimum',
          color: theme.textDanger,
        },
      },
      {
        target_ltv: (
          <InputText small className="custom-ltv">
            <input
              type="number"
              // prevent value change on scroll
              onWheel={(e) => e.currentTarget.blur()}
              value={customLtv}
              onChange={(e) => setCustomLtv(e.target.valueAsNumber)}
            />
          </InputText>
        ),
        asset_to_add: {
          id: 'custom_collateral',
          amount: getRequiredCollateral(customLtv),
          asset: assetInfo.short,
        },
        info: {
          text: 'Calculate target LTV',
          color: theme.textPrimary,
        },
      },
    ];
  }, [customLtv]);

  return (
    <CollaterizationFormStyled>
      <div className="ltv-info">
        <Table columns={tableColumns(assetInfo.short)} data={tableData} />
      </div>
      <DepositAddress assetInfo={assetInfo} />
    </CollaterizationFormStyled>
  );
};
