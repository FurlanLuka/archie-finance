import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';

import { DepositAddress } from '@archie-microservices/ui/dashboard/components';
import { MAX_LINE_OF_CREDIT } from '@archie-microservices/ui/dashboard/constants';
import { copyToClipboard } from '@archie-microservices/ui/dashboard/utils';
import { CollateralAsset } from '@archie-microservices/ui/shared/constants';
import { InputRange, TitleL, BodyM } from '@archie-microservices/ui/shared/ui/design-system';
import { theme } from '@archie-microservices/ui/shared/ui/theme';

import { CollaterizationFormStyled } from './collaterization-form.styled';

interface CollateralizationFormProps {
  assetInfo: CollateralAsset;
  assetPrice: number;
}

export const CollateralizationForm: FC<CollateralizationFormProps> = ({ assetInfo, assetPrice }) => {
  const { t } = useTranslation();

  const [lineOfCredit, setLineOfCredit] = useState(200);
  const [requiredCollateral, setRequiredCollateral] = useState(0);

  useEffect(() => {
    const price = 1 / assetPrice;
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
      <DepositAddress assetInfo={assetInfo} assetAmount={requiredCollateral} showTerms />
    </CollaterizationFormStyled>
  );
};
