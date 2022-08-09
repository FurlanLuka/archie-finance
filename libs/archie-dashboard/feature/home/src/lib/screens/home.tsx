import { format, formatISO, parse, parseISO } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { KycResponse } from '@archie-webapps/shared/data-access/archie-api/kyc/api/get-kyc';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { ParagraphXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { ArchieCard } from '../components/archie-card/archie-card';
import { AvailableCredit } from '../components/available-credit/available-credit';
import { CollateralValue } from '../components/collateral-value/collateral-value';
import { MyRewards } from '../components/my-rewards/my-rewards';
import { NextPayment } from '../components/next-payment/next-payment';
import { RecentTransactions } from '../components/recent-transactions/recent-transactions';
// import { MarginCallAlert } from '../components/alerts/margin-call/margin-call';

import { HomeStyled } from './home.styled';

export const HomeScreen: FC = () => {
  const { t } = useTranslation();

  const getKycResponse: QueryResponse<KycResponse> = useGetKyc();

  const getTitle = () => {
    if (getKycResponse.state === RequestState.SUCCESS) {
      const kycData = getKycResponse.data;

      const getDate = () => format(parseISO(kycData.createdAt), 'MMMM, yyyy');

      return (
        <>
          <SubtitleS className="title">{t('dashboard_home.title', { name: kycData.firstName })}</SubtitleS>
          <ParagraphXS color={theme.textSecondary} className="subtitle">
            {t('dashboard_home.subtitle', { date: getDate() })}
          </ParagraphXS>
        </>
      );
    }

    return <></>;
  };

  return (
    <HomeStyled>
      {/* <MarginCallAlert /> */}
      <div className="section-title">{getTitle()}</div>
      <div className="section-cards">
        <ArchieCard />
        <AvailableCredit />
      </div>
      <div className="section-cards">
        <CollateralValue />
        <NextPayment />
        <MyRewards />
      </div>
      <div className="section-table">
        <RecentTransactions />
      </div>
    </HomeStyled>
  );
};
