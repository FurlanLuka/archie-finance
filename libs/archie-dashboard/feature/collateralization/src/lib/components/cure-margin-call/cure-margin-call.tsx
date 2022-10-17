import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { Loader, ButtonOutline, TitleS, BodyL } from '@archie-webapps/shared/ui/design-system';

import { CollateralUpdatedModal } from '../../components/modals/collateral-updated/collateral-updated';

import { CollateralizationForm } from './blocks/collaterization-form/collaterization-form';
import { useGetLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import BigNumber from 'bignumber.js';

interface CureMarginCallProps {
  selectedAsset: string;
}

export const CureMarginCall: FC<CureMarginCallProps> = ({ selectedAsset }) => {
  const { t } = useTranslation();

  const assetInfo = CollateralAssets[selectedAsset];

  const getLedgerResponse = useGetLedger();
  const getCreditQueryResponse = useGetCredit();

  if (getLedgerResponse.state === RequestState.LOADING || getCreditQueryResponse.state === RequestState.LOADING) {
    return <Loader marginAuto />;
  }

  if (getLedgerResponse.state === RequestState.ERROR || getCreditQueryResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
  }

  if (getLedgerResponse.state === RequestState.SUCCESS && getCreditQueryResponse.state === RequestState.SUCCESS) {
    const ledger = getLedgerResponse.data;
    const currentLedgerAccount = ledger.accounts.find((ledgerAccount) => ledgerAccount.assetId === selectedAsset);
    const creditData = getCreditQueryResponse.data;

    if (!currentLedgerAccount) {
      return <Navigate to="/error" state={{ prevPath: '/collateral', description: "Couldn't fetch price" }} />;
    }

    return (
      <>
        <CollateralUpdatedModal />
        <TitleS className="title">{t('dashboard_collateralization.title', { selectedAsset })}</TitleS>
        <BodyL className="subtitle-margin-call">{t('dashboard_collateralization.subtitle_margin_call')}</BodyL>
        <CollateralizationForm
          assetInfo={assetInfo}
          assetPrice={BigNumber(currentLedgerAccount.assetPrice).toNumber()}
          creditBalance={creditData.utilizationAmount}
          collateralTotalValue={BigNumber(ledger.value).toNumber()}
        />
        <Link to="/collateral" className="cancel-btn">
          <ButtonOutline>{t('btn_cancel')}</ButtonOutline>
        </Link>
      </>
    );
  }

  return <></>;
};
