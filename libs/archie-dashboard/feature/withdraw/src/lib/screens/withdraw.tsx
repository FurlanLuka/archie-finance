import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Navigate, Link } from 'react-router-dom';

import { useGetCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-value';
import { useGetMaxWithdrawalAmount } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-max-withdrawal-amount';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Card, Loader, ParagraphM, ParagraphS } from '@archie-webapps/shared/ui/design-system';

import { WithdrawalForm } from '../components/withdrawal-form/withdrawal-form';

import { WithdrawScreenStyled } from './withdraw.styled';

export const WithdrawScreen: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // TODO useParams this
  const currentAsset = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

  const getMaxWithdrawalAmountResponse = useGetMaxWithdrawalAmount(currentAsset);
  const getCollateralValueReponse = useGetCollateralValue();

  const getContent = () => {
    if (
      getMaxWithdrawalAmountResponse.state === RequestState.LOADING ||
      getCollateralValueReponse.state === RequestState.LOADING
    ) {
      return <Loader className="loader" />;
    }

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.ERROR ||
      getCollateralValueReponse.state === RequestState.ERROR
    ) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.SUCCESS &&
      getCollateralValueReponse.state === RequestState.SUCCESS
    ) {
      const asset = getCollateralValueReponse.data.find((a) => a.asset === currentAsset);

      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('dashboard_withdraw.title', { currentAsset })}
          </ParagraphM>
          <ParagraphS className="subtitle">
            {asset ? (
              t('dashboard_withdraw.subtitle', {
                asset: asset.asset,
                assetAmount: asset.assetAmount,
                assetValue: asset.price.toFixed(2),
              })
            ) : (
              <>
                {t('dashboard_withdraw.subtitle_empty', {
                  asset: currentAsset,
                })}
                <Link to={`/collateral/add/${currentAsset}`} className="link">
                  {t('dashboard_withdraw.subtitle_empty_link')}
                </Link>
              </>
            )}
          </ParagraphS>
          <WithdrawalForm
            currentAsset={currentAsset}
            maxAmount={getMaxWithdrawalAmountResponse.data.maxAmount}
            collateral={getCollateralValueReponse.data}
          />
        </>
      );
    }

    return null;
  };

  return (
    <WithdrawScreenStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem" minHeight="750px">
        {getContent()}
      </Card>
    </WithdrawScreenStyled>
  );
};
