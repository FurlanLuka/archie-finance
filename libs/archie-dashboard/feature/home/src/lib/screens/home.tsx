import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { GetCreditResponse } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { CardsImage } from '@archie-webapps/shared/data-access/archie-api/rize/api/get-cards-image';
import { useGetCardsImage } from '@archie-webapps/shared/data-access/archie-api/rize/hooks/use-cards-image';
import {
  ButtonOutline,
  Card,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
  ParagraphXXS,
  SubtitleS,
  Table,
} from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import imgCard from '../../assets/card-placeholder.png';
// import { MarginCallAlert } from '../components/alerts/margin-call/margin-call';
import { CollateralValue } from '../components/charts/collateral-value/collateral-value';
import { LoanToValue } from '../components/charts/loan-to-value/loan-to-value';
import { NextPayment } from '../components/charts/next-payment/next-payment';
import { RevealCardModal } from '../components/modals/reveal-card/reveal-card';
import { tableData } from '../constants/table-data';
import { tableColumns } from '../fixtures/table-fixture';

import { HomeStyled } from './home.styled';

export const WalletAndCollateralScreen: FC = () => {
  const { t } = useTranslation();

  const [revealCardModalOpen, setRevealCardModalOpen] = useState(false);
  const [revealCardData, setRevealCardData] = useState(false);

  const getCardsImageResponse: QueryResponse<CardsImage> = useGetCardsImage();
  const getCreditQueryResponse: QueryResponse<GetCreditResponse> = useGetCredit();
  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  const getCardsImage = () => {
    if (getCardsImageResponse.state === RequestState.SUCCESS) {
      return getCardsImageResponse.data.image;
    }

    return '';
  };

  const getCredit = () => {
    if (getCreditQueryResponse.state === RequestState.SUCCESS) {
      return getCreditQueryResponse.data;
    }

    return { totalCredit: 0, availableCredit: 0 };
  };

  const getCollateralTotalValue = () => {
    if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
      return getCollateralTotalValueResponse.data.value;
    }

    return 0;
  };

  getCredit();

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

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
        <Card
          backgroundImage={`data:image/jpeg;base64,${getCardsImage()}`}
          className="archie-card clickable"
          onClick={() => (revealCardData ? setRevealCardModalOpen(false) : setRevealCardModalOpen(true))}
        >
          {/* <div className="card-data">
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
          </div> */}
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
                ${getFormattedValue(getCredit().totalCredit - getCredit().availableCredit)}
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
                ${getFormattedValue(getCredit().availableCredit)}
              </SubtitleS>
              <ParagraphXXS color={theme.textSecondary} weight={500} className="card-text">
                Line of Credit: ${getFormattedValue(getCredit().totalCredit)}
              </ParagraphXXS>
            </div>
          </div>
          <div className="card-group p-bottom-sm">
            <LoanToValue />
          </div>
        </Card>
      </div>

      <div className="section-cards">
        <Card column alignItems="flex-start" justifyContent="space-between" padding="1.5rem">
          <div>
            <ParagraphXS weight={700} className="card-title">
              Collateral Value
            </ParagraphXS>
            <div className="text-group card-info">
              <SubtitleS weight={400}>${getFormattedValue(getCollateralTotalValue())}</SubtitleS>
              {/* <ParagraphXS weight={500} color={theme.textSuccess}>
              ↑
            </ParagraphXS> */}
            </div>
          </div>
          {/* <CollateralValue /> */}
          <div className="btn-group">
            <ButtonOutline maxWidth="auto" small>
              Add
            </ButtonOutline>
            <ButtonOutline maxWidth="auto" small isDisabled>
              Redeem
            </ButtonOutline>
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
    </HomeStyled>
  );
};
