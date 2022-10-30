import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Navigate, Link } from 'react-router-dom';

import { Ledger } from '@archie/ui/shared/data-access/archie-api-dtos';
import {
  QueryResponse,
  RequestState,
} from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { useGetMaxWithdrawalAmount } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-max-withdrawal-amount';
import { Card, Skeleton, TitleS, BodyL } from '@archie/ui/shared/design-system';

import { WithdrawalForm } from '../components/withdrawal-form/withdrawal-form';

import { WithdrawScreenStyled } from './withdraw.styled';

export const WithdrawScreen: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // TODO useParams this
  const currentAsset = location.pathname.slice(
    location.pathname.lastIndexOf('/') + 1,
  );

  const getMaxWithdrawalAmountResponse =
    useGetMaxWithdrawalAmount(currentAsset);
  const getLedgerResponse: QueryResponse<Ledger> = useGetLedger();

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

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.ERROR ||
      getLedgerResponse.state === RequestState.ERROR
    ) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (
      getMaxWithdrawalAmountResponse.state === RequestState.SUCCESS &&
      getLedgerResponse.state === RequestState.SUCCESS
    ) {
      const selectedLedgerAccount = getLedgerResponse.data.accounts.find(
        (ledgerAccount) => ledgerAccount.assetId === currentAsset,
      );

      return (
        <Card column alignItems="center" padding="2.5rem 1.5rem">
          <TitleS className="title">
            {t('dashboard_withdraw.title', { currentAsset })}
          </TitleS>
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
                  asset: currentAsset,
                })}
                <Link to={`/collateral/add/${currentAsset}`} className="link">
                  {t('dashboard_withdraw.subtitle_empty_link')}
                </Link>
              </>
            )}
          </BodyL>
          <WithdrawalForm
            currentAsset={currentAsset}
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
