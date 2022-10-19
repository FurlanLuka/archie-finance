import { FC, useState, useMemo } from 'react';

import { DepositAddress } from '@archie/ui/dashboard/components';
import { CollateralAsset } from '@archie/ui/shared/constants';
import {
  MINIMUM_LTV,
  OK_LTV,
  SUGGESTED_LTV,
} from '@archie/ui/dashboard/constants';
import { calculateCollateralValue } from '@archie/ui/dashboard/utils';
import { Table, InputText } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/ui/theme';

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
  const [customLtv, setCustomLtv] = useState(OK_LTV);

  const getRequiredCollateral = (targetLtv: number) => {
    const collateral = calculateCollateralValue(
      targetLtv,
      creditBalance,
      collateralTotalValue,
    );

    const price = 1 / assetPrice;
    const result = (collateral / (assetInfo.loan_to_value / 100)) * price;

    return Math.ceil(result * 10000) / 10000;
  };

  const handleInputChange = (value: number) => {
    if (!value) {
      setCustomLtv(1);
    }
    if (value > 0 && value <= 100) {
      setCustomLtv(value);
    }
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
              onChange={(e) => handleInputChange(e.target.valueAsNumber)}
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
