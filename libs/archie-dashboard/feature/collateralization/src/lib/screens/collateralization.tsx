import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { LTVStatus } from '@archie-webapps/shared/constants';
import { MarginCallAlert } from '@archie-webapps/archie-dashboard/components';
import { Card, Loader } from '@archie-webapps/shared/ui/design-system';

import { CollateralizationRouteParams } from '../interfaces/routing';
import { AddCollateral } from '../components/add-collateral/add-collateral';
import { CureMarginCall } from '../components/cure-margin-call/cure-margin-call';

import { CollateralizationStyled } from './collateralization.styled';

export const CollateralizationScreen: FC = () => {
  const { asset } = useParams<CollateralizationRouteParams>();
  const getLTVResponse = useGetLTV();

  if (asset === undefined) {
    return <Navigate to="/collateral" />;
  }

  const getContent = () => {
    if (getLTVResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getLTVResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (getLTVResponse.state === RequestState.SUCCESS) {
      const ltvData = getLTVResponse.data;

      if (ltvData.status === LTVStatus.MARGIN_CALL) {
        return <CureMarginCall selectedAsset={asset} />;
      }

      return <AddCollateral selectedAsset={asset} />;
    }

    return null;
  };

  return (
    <CollateralizationStyled>
      <MarginCallAlert />
      <Card column alignItems="center" padding="2.5rem 1.5rem" minHeight="762px">
        {getContent()}
      </Card>
    </CollateralizationStyled>
  );
};
