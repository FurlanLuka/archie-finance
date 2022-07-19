import { FC } from 'react';

import { useGetAssetPrice } from '@archie-webapps/shared/data-access-archie-api/asset_price/hooks/use-get-asset-price';
import { Collateral } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral';
import { useCreateCreditLine } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, Loading, ParagraphXS } from '@archie-webapps/ui-design-system';

import { calculateCollateralValue } from '../../../../helpers/collateral';

import * as Styled from './create_credit_line.styled';

interface CreateCreditLineProps {
  collateral: Collateral[];
}

export const CreateCreditLine: FC<CreateCreditLineProps> = ({ collateral }) => {
  const createCreditLine = useCreateCreditLine();
  const getAssetPriceResponse = useGetAssetPrice();

  function getContent() {
    switch (getAssetPriceResponse.state) {
      case RequestState.LOADING:
        return <Loading />;
      case RequestState.SUCCESS:
        return (
          <>
            <ParagraphXS weight={700} className="creditInfo">
              You are collateralizing {collateral.map((asset) => `${asset.amount} ${asset.asset}, `)} for a credit line
              of {calculateCollateralValue(collateral, getAssetPriceResponse.data)}$.
            </ParagraphXS>
            <ButtonPrimary
              onClick={() => {
                if (createCreditLine.state === RequestState.IDLE) {
                  createCreditLine.mutate({});
                }
              }}
            >
              Let's go
            </ButtonPrimary>
          </>
        );
      default:
        return null;
    }
  }

  return <Styled.FloatingCreditLine>{getContent()}</Styled.FloatingCreditLine>;
};
