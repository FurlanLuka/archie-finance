import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';

import { MAX_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { AssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/api/get-asset-price';
import { InputRange, ParagraphXS, SubtitleM } from '@archie-webapps/shared/ui/design-system';
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
      <InputRange
        className="credit-slider"
        label={t('collateralization_step.inputs.input_range_label')}
        min={50}
        max={MAX_LINE_OF_CREDIT}
        value={lineOfCredit}
        onChange={setLineOfCredit}
      />
      <div className="result">
        <div className="result-item">
          <ParagraphXS weight={700}>{t('collateralization_step.result.first')}</ParagraphXS>
          <SubtitleM weight={400} id="collateral">
            <span
              className="clickable"
              data-tip="Click to copy"
              onClick={() => copyToClipboard('collateral', requiredCollateral.toString())}
            >
              {getFormattedCollateral()}
            </span>
          </SubtitleM>
          <ReactTooltip
            textColor={theme.tooltipText}
            backgroundColor={theme.tooltipBackground}
            effect="solid"
            delayHide={1000}
          />
        </div>
        <div className="result-item">
          <ParagraphXS weight={700}>{t('collateralization_step.result.second')}</ParagraphXS>
          <SubtitleM weight={400}>{assetInfo.loan_to_value}%</SubtitleM>
        </div>
        <div className="result-item">
          <ParagraphXS weight={700}>{t('collateralization_step.result.third')}</ParagraphXS>
          <SubtitleM weight={400}>{assetInfo.interest_rate}%</SubtitleM>
        </div>
      </div>
      <DepositAddress assetInfo={assetInfo} assetAmount={requiredCollateral} />
    </CollaterizationFormStyled>
  );
};
