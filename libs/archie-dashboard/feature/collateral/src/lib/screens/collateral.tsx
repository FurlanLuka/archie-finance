import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { MarginCallAlert } from '@archie-webapps/archie-dashboard/components';
import { LTVText, LTVColor } from '@archie-webapps/shared/constants';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { CreditLine } from '@archie-webapps/shared/data-access/archie-api/credit_line/api/get-credit-line';
import { useGetCreditLine } from '@archie-webapps/shared/data-access/archie-api/credit_line/hooks/use-get-credit-line';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';
import { useGetLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { Card, Loader, Badge, TitleM, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralInfo } from '../components/collateral-info/collateral-info';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getLedgerResponse: QueryResponse<Ledger> = useGetLedger();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();
  const getCreditLineResponse: QueryResponse<CreditLine> = useGetCreditLine();

  const getContent = () => {
    // TODO: Think of optimizing these
    if (
      getLedgerResponse.state === RequestState.LOADING ||
      getLTVResponse.state === RequestState.LOADING ||
      getCreditLineResponse.state === RequestState.LOADING
    ) {
      return <Loader marginAuto />;
    }

    if (
      getLedgerResponse.state === RequestState.ERROR ||
      getLTVResponse.state === RequestState.ERROR ||
      getCreditLineResponse.state === RequestState.ERROR
    ) {
      return <Navigate to="/error" state={{ prevPath: '/collateral' }} />;
    }

    if (
      getLedgerResponse.state === RequestState.SUCCESS &&
      getLTVResponse.state === RequestState.SUCCESS &&
      getCreditLineResponse.state === RequestState.SUCCESS
    ) {
      const ltvData = getLTVResponse.data;

      return (
        <>
          <div className="subtitle-group">
            <TitleS className="subtitle">{t('dashboard_collateral.title')}</TitleS>
            <TitleM weight={400} className="total">
              ${getLedgerResponse.data.value}
            </TitleM>
            <div className="ltv">
              <div className="ltv-group">
                <BodyM weight={700} color={theme.textSecondary}>
                  {t('ltv')}:
                </BodyM>
                <TitleS weight={400}>{ltvData.ltv.toFixed(2)}%</TitleS>
              </div>
              <Badge statusColor={LTVColor[ltvData.status]}>{LTVText[ltvData.status]}</Badge>
            </div>
          </div>
          <CollateralInfo
            ledger={getLedgerResponse.data}
            creditLine={getCreditLineResponse.data}
            ltvStatus={ltvData.status}
          />
        </>
      );
    }

    return null;
  };

  return (
    <CollateralStyled>
      <MarginCallAlert />
      <Card column padding="1.5rem 1.5rem 2rem" minHeight="560px">
        {getContent()}
      </Card>
    </CollateralStyled>
  );
};
