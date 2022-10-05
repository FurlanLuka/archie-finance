import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { CollateralAssetSelect, DepositAddress } from '@archie-webapps/archie-dashboard/components';
import { MAX_LINE_OF_CREDIT, MIN_LINE_OF_CREDIT, OnboardingStep } from '@archie-webapps/archie-dashboard/constants';
import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { AssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/api/get-asset-price';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Container, Card, Loader, InputRange, TitleL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralDepositAlerts } from '../../components/collateral-deposit-alerts/collateral-deposit-alerts';
import { StepsIndicator } from '../../components/steps-indicator/steps-indicator';

import { CollateralizationScreenStyled } from './collateralization-screen.styled';

export const CollateralizationScreen: FC = () => {
  const { t } = useTranslation();

  const [lineOfCredit, setLineOfCredit] = useState(MIN_LINE_OF_CREDIT);
  const [selectedCollateralAsset, setSelectedCollateralAsset] = useState<CollateralAsset>();
  const [requiredCollateral, setRequiredCollateral] = useState(0);

  const getAssetPriceResponse: QueryResponse<AssetPrice[]> = useGetAssetPrice();

  useEffect(() => {
    if (getAssetPriceResponse.state === RequestState.SUCCESS) {
      if (selectedCollateralAsset) {
        const asset = getAssetPriceResponse.data.find((asset) => asset.asset === selectedCollateralAsset.id);

        if (asset) {
          const assetPrice = 1 / asset.price;
          const result = (lineOfCredit / (selectedCollateralAsset.loan_to_value / 100)) * assetPrice;

          setRequiredCollateral(Math.ceil(result * 10000) / 10000);
        }
      }
    }
  }, [getAssetPriceResponse, lineOfCredit, selectedCollateralAsset]);

  const getFormattedCollateral = () => {
    const value =
      selectedCollateralAsset?.short === 'USDC'
        ? Number(requiredCollateral.toFixed(2)) * 1
        : Number(requiredCollateral.toFixed(4)) * 1;

    return `${value} ${selectedCollateralAsset?.short}`;
  };

  function getContent() {
    if (getAssetPriceResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getAssetPriceResponse.state === RequestState.ERROR) {
      return <Navigate to="/onboarding/error" state={{ prevPath: '/onboarding' }} />;
    }

    if (getAssetPriceResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <CollateralDepositAlerts />
          <TitleL className="title">{t('collateralization_step.title')}</TitleL>
          <BodyM className="subtitle">{t('collateralization_step.subtitle')}</BodyM>
          <div className="inputs">
            <CollateralAssetSelect
              selectedAsset={selectedCollateralAsset}
              setSelectedAsset={setSelectedCollateralAsset}
            />
            <InputRange
              label={t('collateralization_step.inputs.input_range_label')}
              min={MIN_LINE_OF_CREDIT}
              max={MAX_LINE_OF_CREDIT}
              value={lineOfCredit}
              onChange={setLineOfCredit}
            />
          </div>
          <div className="result">
            <div className="result-item">
              <BodyM weight={700}>{t('collateralization_step.result.first')}</BodyM>
              <TitleL weight={400} id="collateral" className="text">
                {selectedCollateralAsset ? (
                  <span
                    className="clickable"
                    data-tip="Click to copy"
                    onClick={() => copyToClipboard('collateral', requiredCollateral.toString())}
                  >
                    {getFormattedCollateral()}
                  </span>
                ) : (
                  <span className="placeholder">0</span>
                )}
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
              <TitleL weight={400} className="text">
                {selectedCollateralAsset ? (
                  `${selectedCollateralAsset.loan_to_value}%`
                ) : (
                  <span className="placeholder">0%</span>
                )}
              </TitleL>
            </div>
            <div className="result-item">
              <BodyM weight={700}>{t('collateralization_step.result.third')}</BodyM>
              <TitleL weight={400} className="text">
                {selectedCollateralAsset ? (
                  `${selectedCollateralAsset.interest_rate}%`
                ) : (
                  <span className="placeholder">0%</span>
                )}
              </TitleL>
            </div>
          </div>
          {selectedCollateralAsset ? (
            <DepositAddress assetInfo={selectedCollateralAsset} assetAmount={requiredCollateral} showTerms />
          ) : (
            <div className="address-placeholder" />
          )}
        </>
      );
    }

    return <></>;
  }

  return (
    <Container column mobileColumn alignItems="center">
      <StepsIndicator currentStep={OnboardingStep.COLLATERALIZE} />
      <CollateralizationScreenStyled>
        <Card
          column
          alignItems="center"
          padding="2.5rem 10% 3.5rem"
          mobilePadding="2.5rem 1.5rem 3.5rem"
          minHeight="945px"
        >
          {getContent()}
        </Card>
      </CollateralizationScreenStyled>
    </Container>
  );
};
