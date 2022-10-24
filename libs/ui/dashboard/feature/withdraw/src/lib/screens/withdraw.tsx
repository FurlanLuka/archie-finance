import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Navigate, Link } from 'react-router-dom';

import { CurrentAssetRouteParams } from '@archie/ui/shared/constants';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { useGetMaxWithdrawalAmount } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-max-withdrawal-amount';
import { Card, Skeleton, TitleS, BodyL } from '@archie/ui/shared/design-system';

import { WithdrawalForm } from '../components/withdrawal-form/withdrawal-form';

import { WithdrawScreenStyled } from './withdraw.styled';

export const WithdrawScreen: FC = () => {
  const { t } = useTranslation();
  const params = useParams<CurrentAssetRouteParams>();

  console.log(params);

  const asset = 'SOL';

  const getMaxWithdrawalAmountResponse = useGetMaxWithdrawalAmount(asset);
  const getLedgerResponse = useGetLedger();

  const getContent = () => {
    if (
      getMaxWithdrawalAmountResponse.state === RequestState.LOADING ||
      getLedgerResponse.state === RequestState.LOADING
    ) {
      return (
        <Card height="682px">
          <Skeleton />
        </Card>
      );
    }

    if (getMaxWithdrawalAmountResponse.state === RequestState.ERROR || getLedgerResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.SUCCESS &&
      getLedgerResponse.state === RequestState.SUCCESS
    ) {
      const selectedLedgerAccount = getLedgerResponse.data.accounts.find(
        (ledgerAccount) => ledgerAccount.assetId === asset,
      );

      return (
        <Card column alignItems="center" padding="2.5rem 1.5rem">
          <TitleS className="title">{t('dashboard_withdraw.title', { asset })}</TitleS>
          <BodyL className="subtitle">
            {selectedLedgerAccount ? (
              t('dashboard_withdraw.subtitle', {
                asset: selectedLedgerAccount.assetId,
                assetAmount: selectedLedgerAccount.assetAmount,
                assetValue: selectedLedgerAccount.accountValue,
              })
            ) : (
              <>
                {t('dashboard_withdraw.subtitle_empty', {
                  asset,
                })}
                <Link to={`/collateral/add/${asset}`} className="link">
                  {t('dashboard_withdraw.subtitle_empty_link')}
                </Link>
              </>
            )}
          </BodyL>
          <WithdrawalForm
            currentAsset={asset}
            maxAmount={getMaxWithdrawalAmountResponse.data.maxAmount}
            ledger={getLedgerResponse.data}
          />
        </Card>
      );
    }

    return null;
  };

  return <WithdrawScreenStyled>{getContent()}</WithdrawScreenStyled>;
};
