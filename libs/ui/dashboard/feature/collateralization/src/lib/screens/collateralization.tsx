import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { MarginCallAlert } from '@archie/ui/dashboard/components';
import { CurrentAssetRouteParams } from '@archie/ui/shared/constants';
import { useGetLTV } from '@archie/ui/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { Card, Skeleton } from '@archie/ui/shared/design-system';

import { AddCollateral } from '../components/add-collateral/add-collateral';
import { CureMarginCall } from '../components/cure-margin-call/cure-margin-call';

import { CollateralizationStyled } from './collateralization.styled';

export const CollateralizationScreen: FC = () => {
  const { asset } = useParams<CurrentAssetRouteParams>();

  const getLTVResponse = useGetLTV();

  if (asset === undefined) {
    return <Navigate to="/collateral" />;
  }

  const getContent = () => {
    if (getLTVResponse.state === RequestState.LOADING) {
      return (
        <Card height="782px">
          <Skeleton />
        </Card>
      );
    }

    if (getLTVResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (getLTVResponse.state === RequestState.SUCCESS) {
      const ltvData = getLTVResponse.data;

      if (ltvData.status === LtvStatus.margin_call) {
        return <CureMarginCall selectedAsset={asset} />;
      }

      return <AddCollateral selectedAsset={asset} />;
    }

    return null;
  };

  return (
    <CollateralizationStyled>
      <MarginCallAlert />
      {getContent()}
    </CollateralizationStyled>
  );
};
