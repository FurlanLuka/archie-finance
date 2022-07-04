<<<<<<< HEAD:libs/archie-dashboard/feature-dashboard/src/lib/screens/dashboard-screen.tsx
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { GetOnboardingResponse } from '@archie-webapps/shared/data-access-archie-api/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie-webapps/shared/data-access-archie-api/onboarding/hooks/use-get-onboarding';
import {
  ButtonGhost,
  ButtonOutline,
  Card,
  Header,
  Loading,
  Page,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
  SubtitleS,
  Table,
} from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';

import imgCard from '../../assets/card-placeholder.png';
import { CollateralValue } from '../components/charts/collateral-value/collateral-value';
import { LoanToValue } from '../components/charts/loan-to-value/loan-to-value';
import { NextPayment } from '../components/charts/next-payment/next-payment';
import { MarginCallAlert } from '../components/margin-call-alert/margin-call-alert';
import { Navigation } from '../components/navigation/navigation';
import { RevealCardModal } from '../components/reveal-card-modal/reveal-card-modal';
import { tableData } from '../constants/table-data';
import { tableColumns } from '../fixtures/table-fixture';

import { DashboardStyled } from './dashboard-screen.styled';

export const DashboardScreen: FC = () => {
  const { t } = useTranslation();

=======
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Header, Loading, Page, Container } from '@archie-webapps/ui-design-system';

import { Navigation } from './components/navigation/navigation';
import { History } from './components/screens/history/history';
import { Rewards } from './components/screens/rewards/rewards';
import { Settings } from './components/screens/settings/settings';
import { WalletAndCollateral } from './components/screens/wallet-and-collateral/wallet-and-collateral';

export const DashboardRoute: FC = () => {
>>>>>>> feature/forms:apps/archie-dashboard/src/routes/index/index-route.tsx
  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  if (queryResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  if (queryResponse.state === RequestState.SUCCESS) {
    if (!queryResponse.data.completed) {
      return <Navigate to="/onboarding" />;
    }
  }

  return (
    <>
      <Header maxWidth="100%" />
      <Page>
<<<<<<< HEAD:libs/archie-dashboard/feature-dashboard/src/lib/screens/dashboard-screen.tsx
        <DashboardStyled>
          <Navigation />
          <div className="content">
            <SubtitleS className="title">{t('dashboard.title', { name })}</SubtitleS>
            <ParagraphXS color={theme.textSecondary} className="subtitle">
              {t('dashboard.subtitle', { date })}
            </ParagraphXS>
            {/* <MarginCallAlert /> */}
            <div className="section-cards">
              <Card
                backgroundImage={imgCard}
                className="archie-card clickable"
                onClick={() => (revealCardData ? setRevealCardModalOpen(false) : setRevealCardModalOpen(true))}
              >
                <div className="card-data">
                  <ParagraphS weight={500}>{revealCardData ? '3443 6546 6457 8021' : '•••• •••• •••• 8021'}</ParagraphS>
                  <div className="card-data-group">
                    <ParagraphS weight={500}>
                      <span>EXP</span>
                      {revealCardData ? '09/12' : '••/••'}
                    </ParagraphS>
                    <ParagraphS weight={500}>
                      <span>CVV</span>
                      {revealCardData ? '675' : '•••'}
                    </ParagraphS>
                  </div>
                </div>
                <div className="card-status">
                  <ParagraphXXS weight={800} color={theme.textLight}>
                    Active
                  </ParagraphXXS>
                </div>
              </Card>
              <RevealCardModal
                isOpen={revealCardModalOpen}
                close={() => setRevealCardModalOpen(false)}
                onConfirm={() => setRevealCardData(true)}
              />
              <Card justifyContent="space-between" padding="1.5rem">
                <div className="card-group">
                  <div className="card-group p-bottom">
                    <ParagraphXS weight={700} className="card-title">
                      ArchCredit Balance
                    </ParagraphXS>
                    <SubtitleS weight={400} className="card-info border-active">
                      $1,000.00
                    </SubtitleS>
                    <ButtonOutline maxWidth="auto" small>
                      Pay now
                    </ButtonOutline>
                  </div>
                  <div className="card-group">
                    <ParagraphXS weight={700} className="card-title">
                      Available Credit
                    </ParagraphXS>
                    <SubtitleS weight={400} className="card-info border-default">
                      $4,000.00
                    </SubtitleS>
                    <ParagraphXXS color={theme.textSecondary} weight={500} className="card-text">
                      Line of Credit: $5,000.00
                    </ParagraphXXS>
                  </div>
                </div>
                <div className="card-group">
                  <LoanToValue />
                </div>
              </Card>
            </div>

            <div className="section-cards">
              <Card column alignItems="flex-start" padding="1.5rem">
                <ParagraphXS weight={700} className="card-title">
                  Next Payment
                </ParagraphXS>
                <SubtitleS weight={400} className="card-info">
                  June 3
                </SubtitleS>
                <NextPayment />
                <ButtonOutline maxWidth="auto" small>
                  Pay now
                </ButtonOutline>
              </Card>
              <Card column alignItems="flex-start" padding="1.5rem">
                <ParagraphXS weight={700} className="card-title">
                  Collateral Value
                </ParagraphXS>
                <SubtitleS weight={400} className="card-info">
                  $10,000
                </SubtitleS>
                <CollateralValue />
                <div className="btn-group">
                  <ButtonOutline maxWidth="auto" small>
                    Add
                  </ButtonOutline>
                  <ButtonGhost maxWidth="auto" small>
                    Redeem
                  </ButtonGhost>
                </div>
              </Card>
              <Card column alignItems="flex-start" padding="1.5rem">
                <ParagraphXS weight={700} className="card-title">
                  My Rewards
                </ParagraphXS>
                <SubtitleS weight={400} className="card-info">
                  1,801
                </SubtitleS>
                <ParagraphXS color={theme.textSecondary} weight={500} className="card-text">
                  +$1,400 Projected Value
                </ParagraphXS>
                <ButtonOutline maxWidth="auto" small>
                  Claim
                </ButtonOutline>
              </Card>
            </div>

            <div className="section-table">
              <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
                <ParagraphM weight={800} className="table-title">
                  Recent Transactions
                </ParagraphM>
                <ButtonOutline maxWidth="auto" small className="table-btn">
                  View More
                </ButtonOutline>
                <Table columns={columns} data={data} />
              </Card>
            </div>
          </div>
        </DashboardStyled>
=======
        <Container justifyContent="center" maxWidth="100%">
          <Navigation />
          <Routes>
            <Route path="/" element={<WalletAndCollateral />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
>>>>>>> feature/forms:apps/archie-dashboard/src/routes/index/index-route.tsx
      </Page>
    </>
  );
};
