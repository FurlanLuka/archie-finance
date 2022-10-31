import BigNumber from 'bignumber.js';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { CollateralAssets } from '@archie/ui/shared/constants';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { Card, Skeleton, ButtonOutline, TitleS, BodyL } from '@archie/ui/shared/design-system';

import { CollateralUpdatedModal } from '../../components/modals/collateral-updated/collateral-updated';

import { CollateralizationCalculator } from './blocks/collateralization-calculator/collateralization-calculator';

interface AddCollateralProps {
  selectedAsset: string;
}

export const AddCollateral: FC<AddCollateralProps> = ({ selectedAsset }) => {
  const { t } = useTranslation();

  const assetInfo = CollateralAssets[selectedAsset];

  const getLedgerResponse = useGetLedger();

  if (getLedgerResponse.state === RequestState.LOADING) {
    return (
      <Card height="782px">
        <Skeleton />
      </Card>
    );
  }

  if (getLedgerResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
  }

  if (getLedgerResponse.state === RequestState.SUCCESS) {
    const ledger = getLedgerResponse.data;
    const currentLedgerAccount = ledger.accounts.find((ledgerAccount) => ledgerAccount.assetId === selectedAsset);

    if (!currentLedgerAccount) {
      return (
        <Navigate
          to="/error"
          state={{
            prevPath: '/collateral',
            description: "Couldn't fetch price",
          }}
        />
      );
    }

    return (
      <>
        <CollateralUpdatedModal />
        <Card column alignItems="center" padding="2.5rem 1.5rem">
          <TitleS className="title">{t('dashboard_collateralization.title', { selectedAsset })}</TitleS>
          <BodyL className="subtitle-credit">
            {t('dashboard_collateralization.subtitle_credit', {
              collateralTotalValue: ledger.value,
            })}
          </BodyL>
          {currentLedgerAccount && (
            <BodyL className="subtitle-asset">
              {t('dashboard_collateralization.subtitle_asset', {
                collateral: currentLedgerAccount.assetAmount,
                collateralAsset: currentLedgerAccount.assetId,
                collateralValue: currentLedgerAccount.assetPrice,
              })}
            </BodyL>
          )}
          <CollateralizationCalculator
            assetInfo={assetInfo}
            assetPrice={BigNumber(currentLedgerAccount.assetPrice).toNumber()}
          />
          <Link to="/collateral" className="cancel-btn">
            <ButtonOutline>{t('btn_cancel')}</ButtonOutline>
          </Link>
        </Card>
      </>
    );
  }

  return <></>;
};
