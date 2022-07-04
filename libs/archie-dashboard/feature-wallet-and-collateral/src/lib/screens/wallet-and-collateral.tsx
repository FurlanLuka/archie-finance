import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonGhost,
  ButtonOutline,
  Card,
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
// import { MarginCallAlert } from '../components/margin-call-alert/margin-call-alert';
import { RevealCardModal } from '../components/modals/reveal-card/reveal-card';
import { tableData } from '../constants/table-data';
import { tableColumns } from '../fixtures/table-fixture';

import { WalletAndCollateralStyled } from './wallet-and-collateral.styled';

export const WalletAndCollateralScreen: FC = () => {
  const { t } = useTranslation();

  const [revealCardModalOpen, setRevealCardModalOpen] = useState(false);
  const [revealCardData, setRevealCardData] = useState(false);

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

  const name = 'Lando';
  const date = 'February, 2022';

  return (
    <WalletAndCollateralStyled>
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
        <Card justifyContent="space-between" columnReverse padding="1.5rem">
          <div className="card-group">
            <div className="card-group p-bottom">
              <ParagraphXS weight={700} className="card-title">
                ArchCredit Balance
              </ParagraphXS>
              <SubtitleS weight={400} className="card-info border-active">
                $1,000.00
              </SubtitleS>
              <div className="btn-group">
                <ButtonOutline maxWidth="auto" small>
                  Pay now
                </ButtonOutline>
              </div>
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
          <div className="card-group p-bottom-sm">
            <LoanToValue />
          </div>
        </Card>
      </div>

      <div className="section-cards">
        <Card column alignItems="flex-start" padding="1.5rem">
          <ParagraphXS weight={700} className="card-title">
            Collateral Value
          </ParagraphXS>
          <div className="text-group card-info">
            <SubtitleS weight={400}>$10,000</SubtitleS>
            <ParagraphXS weight={500} color={theme.textSuccess}>
              ↑
            </ParagraphXS>
          </div>
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
            Next Payment
          </ParagraphXS>
          <SubtitleS weight={400} className="card-info">
            June 3
          </SubtitleS>
          <NextPayment />
          <div className="btn-group">
            <ButtonOutline maxWidth="auto" small>
              Pay now
            </ButtonOutline>
          </div>
        </Card>
        <Card column alignItems="flex-start" padding="1.5rem">
          <ParagraphXS weight={700} className="card-title">
            My Rewards
          </ParagraphXS>
          <div className="text-group card-info">
            <SubtitleS weight={400}>1,801</SubtitleS>
            <ParagraphXS weight={500}>Points</ParagraphXS>
          </div>
          <div className="text-group card-info">
            <ParagraphXS color={theme.textSuccess} weight={500} className="card-text">
              +$1,400
            </ParagraphXS>
            <ParagraphXXS color={theme.textSecondary} weight={500} className="card-text">
              Projected Value
            </ParagraphXXS>
          </div>
          <div className="btn-group">
            <ButtonOutline maxWidth="auto" small>
              Claim
            </ButtonOutline>
          </div>
        </Card>
      </div>

      <div className="section-table">
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
          <ParagraphM weight={800} className="table-title">
            Recent Transactions
          </ParagraphM>
          <div className="btn-group">
            <ButtonOutline maxWidth="auto" small className="table-btn">
              View More
            </ButtonOutline>
          </div>
          <Table columns={columns} data={data} />
        </Card>
      </div>
    </WalletAndCollateralStyled>
  );
};
