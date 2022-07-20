import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAssetPrice } from '@archie-webapps/shared/data-access-archie-api/asset_price/hooks/use-get-asset-price';
import { Collateral } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral';
import { useCreateCreditLine } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, Loading, ParagraphXS } from '@archie-webapps/ui-design-system';

import { calculateCollateralValue, formatEntireCollateral } from '../../../../helpers/collateral';

import * as Styled from './create_credit_line.styled';

interface CreateCreditLineProps {
  collateral: Collateral[];
}

export const CreateCreditLine: FC<CreateCreditLineProps> = ({ collateral }) => {
  const createCreditLine = useCreateCreditLine();
  const getAssetPriceResponse = useGetAssetPrice();
  const { t } = useTranslation();

  function getContent() {
    switch (getAssetPriceResponse.state) {
      case RequestState.LOADING:
        return <Loading />;
      case RequestState.SUCCESS:
        return (
          <>
            <ParagraphXS weight={700} className="creditInfo">
              {t('collateral_credit_line_popup.text', {
                collateral: formatEntireCollateral(collateral),
                credit_value: calculateCollateralValue(collateral, getAssetPriceResponse.data),
              })}
            </ParagraphXS>
            <ButtonPrimary
              onClick={() => {
                if (createCreditLine.state === RequestState.IDLE) {
                  createCreditLine.mutate({});
                }
              }}
            >
              {t('collateral_credit_line_popup.button_text')}
            </ButtonPrimary>
          </>
        );
      default:
        return null;
    }
  }

  return <Styled.FloatingCreditLine>{getContent()}</Styled.FloatingCreditLine>;
};
