import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';

import { MAX_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { AssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/api/get-asset-price';
import { InputRange, TitleL, BodyM, BodyL } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollaterizationFormStyled } from './collaterization-form.styled';
import { DepositAddress } from '@archie-webapps/archie-dashboard/components';

interface CollateralizationFormProps {
  assetInfo: CollateralAsset;
  assetPrice: AssetPrice;
}

export const CollateralizationForm: FC<CollateralizationFormProps> = ({ assetInfo, assetPrice }) => {
  const { t } = useTranslation();

  const [lineOfCredit, setLineOfCredit] = useState(200);
  const [requiredCollateral, setRequiredCollateral] = useState(0);

  useEffect(() => {
    const price = 1 / assetPrice.price;
    const result = (lineOfCredit / (assetInfo.loan_to_value / 100)) * price;

    setRequiredCollateral(Math.ceil(result * 10000) / 10000);
  }, [lineOfCredit, assetPrice]);

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
          Current LTV: 70%
        </BodyL>
        <BodyL weight={700} color={theme.textSuccess}>
          Suggested LTV: 50%
        </BodyL>
        <BodyL weight={700}>Collateral to add: 0.15 BTC, 1 ETH, or 1459 USDC</BodyL>
      </div>
      <hr className="divider" />
      <InputRange
        className="credit-slider"
        label={t('collateralization_step.inputs.input_range_label_margin_call')}
        min={50}
        max={MAX_LINE_OF_CREDIT}
        value={lineOfCredit}
        onChange={setLineOfCredit}
      />
      <div className="result">
        <div className="result-item">
          <BodyM weight={700}>{t('collateralization_step.result.first')}</BodyM>
          <TitleL weight={400} id="collateral">
            <span
              className="clickable"
              data-tip="Click to copy"
              onClick={() => copyToClipboard('collateral', requiredCollateral.toString())}
            >
              {getFormattedCollateral()}
            </span>
          </TitleL>
          <ReactTooltip
            textColor={theme.tooltipText}
            backgroundColor={theme.tooltipBackground}
            effect="solid"
            delayHide={1000}
          />
        </div>
        <div className="result-item">
          <BodyM weight={700}>{t('collateralization_step.result.second')}</BodyM>
          <TitleL weight={400}>{assetInfo.loan_to_value}%</TitleL>
        </div>
        <div className="result-item">
          <BodyM weight={700}>{t('collateralization_step.result.third')}</BodyM>
          <TitleL weight={400}>{assetInfo.interest_rate}%</TitleL>
        </div>
      </div>
      <DepositAddress assetInfo={assetInfo} assetAmount={requiredCollateral} />
    </CollaterizationFormStyled>
  );
};
