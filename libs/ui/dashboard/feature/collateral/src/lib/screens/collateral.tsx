import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { MarginCallAlert } from '@archie/ui/dashboard/components';
import { LTVText, LTVColor } from '@archie/ui/shared/constants';
import { useGetLTV } from '@archie/ui/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { useGetCreditLine } from '@archie/ui/shared/data-access/archie-api/credit_line/hooks/use-get-credit-line';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import {
  Card,
  Skeleton,
  Badge,
  TitleM,
  TitleS,
  BodyM,
} from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { CollateralInfo } from '../components/collateral-info/collateral-info';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const getLedgerResponse = useGetLedger();
  const getLTVResponse = useGetLTV();
  const getCreditLineResponse = useGetCreditLine();

  const getContent = () => {
    // TODO: Think of optimizing these
    if (
      getLedgerResponse.state === RequestState.LOADING ||
      getLTVResponse.state === RequestState.LOADING ||
      getCreditLineResponse.state === RequestState.LOADING
    ) {
      return (
        <Card height="528px">
          <Skeleton />
        </Card>
      );
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
        <Card column padding="1.5rem 1.5rem 2rem">
          <div className="subtitle-group">
            <TitleS className="subtitle">
              {t('dashboard_collateral.subtitle')}
            </TitleS>
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
              <Badge statusColor={LTVColor[ltvData.status]}>
                {LTVText[ltvData.status]}
              </Badge>
            </div>
          </div>
          <CollateralInfo
            ledger={getLedgerResponse.data}
            creditLine={getCreditLineResponse.data}
            ltvStatus={ltvData.status}
          />
        </Card>
      );
    }

    return null;
  };

  return (
    <CollateralStyled>
      <MarginCallAlert />
      <TitleM className="title">{t('dashboard_collateral.title')}</TitleM>
      {getContent()}
    </CollateralStyled>
  );
};
