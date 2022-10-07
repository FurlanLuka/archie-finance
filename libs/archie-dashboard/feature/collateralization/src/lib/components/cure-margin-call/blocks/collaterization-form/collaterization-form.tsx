import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';

import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { AssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/api/get-asset-price';
import { BodyL } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollaterizationFormStyled } from './collaterization-form.styled';
import { DepositAddress } from '@archie-webapps/archie-dashboard/components';

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
  const { t } = useTranslation();

  const [requiredCollateral, setRequiredCollateral] = useState(0);

  useEffect(() => {
    const price = 1 / assetPrice.price;
    const result = (minCollateral / (assetInfo.loan_to_value / 100)) * price;

    setRequiredCollateral(Math.ceil(result * 10000) / 10000);
  }, [minCollateral, assetPrice]);

  const getFormattedCollateral = () => {
    const value =
      assetInfo.short === 'USDC'
        ? Number(requiredCollateral.toFixed(2)) * 1
        : Number(requiredCollateral.toFixed(4)) * 1;

    return `${value} ${assetInfo.short}`;
  };

  return (
    <CollaterizationFormStyled>
      <div className="ltv-info">
        <BodyL weight={700} color={theme.textDanger}>
          {t('collateralization_step.margin_call_info.current_ltv', { ltv: currentLtv.toFixed(2) })}
        </BodyL>
        <BodyL weight={700} color={theme.textSuccess}>
          {t('collateralization_step.margin_call_info.suggested_ltv')}
        </BodyL>
        <BodyL weight={700}>
          {t('collateralization_step.margin_call_info.collateral_to_add', { collateral: getFormattedCollateral() })}
        </BodyL>
      </div>
      <DepositAddress assetInfo={assetInfo} />
    </CollaterizationFormStyled>
  );
};
