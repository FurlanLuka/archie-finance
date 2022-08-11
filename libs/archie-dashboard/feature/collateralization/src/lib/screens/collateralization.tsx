import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { calculateCollateralTotalValue, getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { Card, Loader, ButtonOutline, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { CollateralizationRouteParams } from '../interfaces/routing';
import { CollateralizationForm } from '../components/collaterization-form/collaterization-form';
import { CollateralDeposit } from '../components/collateral-updated/collateral-updated';

import { CollateralizationStyled } from './collateralization.styled';

export const CollateralizationScreen: FC = () => {
  const { t } = useTranslation();
  const { asset } = useParams<CollateralizationRouteParams>();

  if (asset === undefined) {
    return null;
  }

  const assetInfo = CollateralAssets[asset];

  const getCollateralValueResponse = useGetCollateralValue();
  const getAssetPriceResponse = useGetAssetPrice();

  const getContent = () => {
    if (
      getCollateralValueResponse.state === RequestState.LOADING ||
      getAssetPriceResponse.state === RequestState.LOADING
    ) {
      return <Loader />;
    }

    if (getCollateralValueResponse.state === RequestState.ERROR || getAssetPriceResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (
      getCollateralValueResponse.state === RequestState.SUCCESS &&
      getAssetPriceResponse.state === RequestState.SUCCESS
    ) {
      const initialCollateral = getCollateralValueResponse.data;
      const collateralTotalValue = calculateCollateralTotalValue(initialCollateral);
      const currentAsset = initialCollateral.find((c) => c.asset === asset);
      const assetPrice = getAssetPriceResponse.data.find((p) => p.asset === assetInfo.id);

      if (!asset) {
        return (
          <Navigate
            to="/error"
            state={{ prevPath: '/collateral', description: 'You do not have this asset collateralized' }}
          />
        );
      }

      if (!assetPrice) {
        return <Navigate to="/error" state={{ prevPath: '/collateral', description: "Couldn't fetch price" }} />;
      }

      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('dashboard_collateralization.title', { asset })}
          </ParagraphM>
          <ParagraphS className="subtitle-credit">
            {t('dashboard_collateralization.subtitle_credit', {
              collateralTotalValue: getFormattedValue(collateralTotalValue),
            })}
          </ParagraphS>
          {currentAsset && (
            <ParagraphS className="subtitle-asset">
              {t('dashboard_collateralization.subtitle_asset', {
                collateral: currentAsset.assetAmount,
                collateralAsset: currentAsset.asset,
                collateralValue: currentAsset.price.toFixed(2),
              })}
            </ParagraphS>
          )}
          <CollateralDeposit initialCollateral={initialCollateral} />
          <CollateralizationForm assetInfo={assetInfo} assetPrice={assetPrice} />
          <Link to="/collateral" className="cancel-btn">
            <ButtonOutline>{t('btn_cancel')}</ButtonOutline>
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <CollateralizationStyled>
      <Card column alignItems="center" justifyContent="center" padding="2.5rem 1.5rem 3.5rem" minHeight="1040px">
        {getContent()}
      </Card>
    </CollateralizationStyled>
  );
};
