import { FC, useState, useMemo } from 'react';

import { DepositAddress } from '@archie/ui/dashboard/components';
import {
  MINIMUM_LTV,
  OK_LTV,
  SUGGESTED_LTV,
} from '@archie/ui/dashboard/constants';
import { calculateCollateralValue } from '@archie/ui/dashboard/utils';
import { CollateralAsset } from '@archie/ui/shared/constants';
import { Table, InputText } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { CollaterizationFormStyled } from './collaterization-form.styled';
import { tableColumns } from './fixtures/table-fixtures';
import { LtvTableEntry } from './interfaces';

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

  const getRequiredCollateral = (targetLtv: number): number => {
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

  const tableData: LtvTableEntry[] = useMemo(() => {
    return [
      {
        targetLtv: `${SUGGESTED_LTV}%`,
        assetToAdd: {
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
        targetLtv: `${MINIMUM_LTV}%`,
        assetToAdd: {
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
        targetLtv: (
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
        assetToAdd: {
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
