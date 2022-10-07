import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { MINIMUM_LTV } from '@archie-webapps/archie-dashboard/constants';
import { calculateCollateralValue } from '@archie-webapps/archie-dashboard/utils';
import { Loader, ButtonOutline, TitleS, BodyL } from '@archie-webapps/shared/ui/design-system';

import { CollateralUpdatedModal } from '../../components/modals/collateral-updated/collateral-updated';

import { CollateralizationForm } from './blocks/collaterization-form/collaterization-form';
import { useGetLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import BigNumber from 'bignumber.js';

interface CureMarginCallProps {
  selectedAsset: string;
}

export const CureMarginCall: FC<CureMarginCallProps> = ({ selectedAsset }) => {
  const { t } = useTranslation();

  const assetInfo = CollateralAssets[selectedAsset];

  const getLedgerResponse = useGetLedger();
  const getAssetPriceResponse = useGetAssetPrice();
  const getCreditQueryResponse = useGetCredit();
  const getLTVResponse = useGetLTV();

  // TODO: Definitely think of optimizing these
  if (
    getLedgerResponse.state === RequestState.LOADING ||
    getAssetPriceResponse.state === RequestState.LOADING ||
    getCreditQueryResponse.state === RequestState.LOADING ||
    getLTVResponse.state === RequestState.LOADING
  ) {
    return <Loader marginAuto />;
  }

  if (
    getLedgerResponse.state === RequestState.ERROR ||
    getAssetPriceResponse.state === RequestState.ERROR ||
    getCreditQueryResponse.state === RequestState.ERROR ||
    getLTVResponse.state === RequestState.ERROR
  ) {
    return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
  }

  if (
    getLedgerResponse.state === RequestState.SUCCESS &&
    getAssetPriceResponse.state === RequestState.SUCCESS &&
    getCreditQueryResponse.state === RequestState.SUCCESS &&
    getLTVResponse.state === RequestState.SUCCESS
  ) {
    const ledger = getLedgerResponse.data;
    const assetPrice = getAssetPriceResponse.data.find((asset) => asset.assetId === assetInfo.id);
    const creditData = getCreditQueryResponse.data;
    const ltvData = getLTVResponse.data;

    const collateralMinValue = calculateCollateralValue(
      MINIMUM_LTV,
      creditData.utilizationAmount,
      BigNumber(ledger.value).toNumber(),
    );

    if (!assetPrice) {
      return <Navigate to="/error" state={{ prevPath: '/collateral', description: "Couldn't fetch price" }} />;
    }

    return (
      <>
        <CollateralUpdatedModal initialLedger={ledger} />
        <TitleS className="title">{t('dashboard_collateralization.title', { selectedAsset })}</TitleS>
        <BodyL className="subtitle-margin-call">{t('dashboard_collateralization.subtitle_margin_call')}</BodyL>
        <CollateralizationForm
          assetInfo={assetInfo}
          assetPrice={assetPrice}
          currentLtv={ltvData.ltv}
          minCollateral={collateralMinValue}
        />
        <Link to="/collateral" className="cancel-btn">
          <ButtonOutline>{t('btn_cancel')}</ButtonOutline>
        </Link>
      </>
    );
  }

  return <></>;
};
