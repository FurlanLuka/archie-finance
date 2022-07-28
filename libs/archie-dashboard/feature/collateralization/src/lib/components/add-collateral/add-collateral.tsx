import { CollateralAssets } from '@archie-webapps/shared/constants';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Loader } from '@archie-webapps/shared/ui/design-system';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { CollateralizationRouteParams } from '../../interfaces/routing';
import { CollateralizationForm } from '../collaterization-form/collaterization-form';

export const AddCollateral: FC = () => {
  const { asset } = useParams<CollateralizationRouteParams>();

  // react router do be like this
  if (asset === undefined) {
    return null;
  }

  const assetInfo = CollateralAssets[asset];

  const getAssetPriceResponse = useGetAssetPrice();

  if (!assetInfo) {
    return <div>Unsupported asset!</div>;
  }

  function getContent() {
    switch (getAssetPriceResponse.state) {
      case RequestState.LOADING:
        return <Loader />;
      case RequestState.SUCCESS:
        const assetPrice = getAssetPriceResponse.data.find((p) => p.asset === assetInfo.id);

        if (!assetPrice) {
          return <div>Couldn't fetch price :(</div>;
        }

        return <CollateralizationForm assetInfo={assetInfo} assetPrice={assetPrice} />;
      case RequestState.ERROR:
        return <div>Something went wrong :(</div>;
      default:
        return null;
    }
  }

  return getContent();
};
