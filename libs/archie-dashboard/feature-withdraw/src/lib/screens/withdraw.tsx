import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useGetCollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-collateral-value';
import { useGetMaxWithdrawalAmount } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-max-withdrawal-amount';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { Card, ParagraphM, ParagraphS } from '@archie-webapps/ui-design-system';

import { WithdrawalForm } from '../components/withdrawal-form/withdrawal-form';
import { WithdrawalSkeleton } from '../components/withdrawal-skeleton/withdrawal-skeleton';

import { WithdrawScreenStyled } from './withdraw.styled';

export const WithdrawScreen: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentAsset = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

  const getMaxWithdrawalAmountResponse = useGetMaxWithdrawalAmount(currentAsset);
  const getCollateralValueReponse = useGetCollateralValue();

  function getContent() {
    if (
      getMaxWithdrawalAmountResponse.state === RequestState.LOADING ||
      getCollateralValueReponse.state === RequestState.LOADING
    ) {
      return <WithdrawalSkeleton />;
    }

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.ERROR ||
      getCollateralValueReponse.state === RequestState.ERROR
    ) {
      return <div>Something went wrong :( </div>;
    }

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.SUCCESS &&
      getCollateralValueReponse.state === RequestState.SUCCESS
    ) {
      const asset = getCollateralValueReponse.data.find((a) => a.asset === currentAsset);
      if (!asset) {
        return <div>You do not have this asset collateralized</div>;
      }

      return (
        <>
          <ParagraphS className="subtitle">
            {t('dashboard_withdraw.subtitle', {
              asset: asset.asset,
              assetAmount: asset.assetAmount,
              assetValue: asset.price,
            })}
          </ParagraphS>
          <WithdrawalForm
            currentAsset={currentAsset}
            maxAmount={getMaxWithdrawalAmountResponse.data.maxAmount}
            collateral={getCollateralValueReponse.data}
          />
        </>
      );
    }

    console.error('Withdrawal unhandled request state');
    return null;
  }

  return (
    <WithdrawScreenStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem">
        <ParagraphM weight={800} className="title">
          {t('dashboard_withdraw.title', { currentAsset })}
        </ParagraphM>
        {getContent()}
      </Card>
    </WithdrawScreenStyled>
  );
};
