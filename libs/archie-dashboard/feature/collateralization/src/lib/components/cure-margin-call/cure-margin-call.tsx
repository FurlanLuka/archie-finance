import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { Loader, ButtonOutline, TitleS, BodyL } from '@archie-webapps/shared/ui/design-system';

import { CollateralUpdatedModal } from '../../components/modals/collateral-updated/collateral-updated';

import { CollateralizationForm } from './blocks/collaterization-form/collaterization-form';

interface CureMarginCallProps {
  selectedAsset: string;
}

export const CureMarginCall: FC<CureMarginCallProps> = ({ selectedAsset }) => {
  const { t } = useTranslation();

  const assetInfo = CollateralAssets[selectedAsset];

  const getCollateralValueResponse = useGetCollateralValue();
  const getAssetPriceResponse = useGetAssetPrice();

  if (
    getCollateralValueResponse.state === RequestState.LOADING ||
    getAssetPriceResponse.state === RequestState.LOADING
  ) {
    return <Loader marginAuto />;
  }

  if (getCollateralValueResponse.state === RequestState.ERROR || getAssetPriceResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
  }

  if (
    getCollateralValueResponse.state === RequestState.SUCCESS &&
    getAssetPriceResponse.state === RequestState.SUCCESS
  ) {
    const initialCollateral = getCollateralValueResponse.data;
    const assetPrice = getAssetPriceResponse.data.find((p) => p.asset === assetInfo.id);

    if (!assetPrice) {
      return <Navigate to="/error" state={{ prevPath: '/collateral', description: "Couldn't fetch price" }} />;
    }

    return (
      <>
        <CollateralUpdatedModal initialCollateral={initialCollateral} />
        <TitleS className="title">{t('dashboard_collateralization.title', { selectedAsset })}</TitleS>
        <BodyL className="subtitle-margin-call">{t('dashboard_collateralization.subtitle_margin_call')}</BodyL>
        <CollateralizationForm assetInfo={assetInfo} assetPrice={assetPrice} />
        <Link to="/collateral" className="cancel-btn">
          <ButtonOutline>{t('btn_cancel')}</ButtonOutline>
        </Link>
      </>
    );
  }

  return <></>;
};
