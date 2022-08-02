import { FC } from 'react';
import { useTranslation } from 'react-i18next';

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

export const WalletAndCollateralScreen: FC = () => {
  const { t } = useTranslation();

  const name = 'Lando';
  const date = 'February, 2022';

  return (
    <HomeStyled>
      <SubtitleS className="title">{t('dashboard_home.title', { name })}</SubtitleS>
      <ParagraphXS color={theme.textSecondary} className="subtitle">
        {t('dashboard_home.subtitle', { date })}
      </ParagraphXS>
      {/* <MarginCallAlert /> */}
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
