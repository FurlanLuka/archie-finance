import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import imgCard from '../../assets/images/card-placeholder.png';
import imgCharSample from '../../assets/images/char-sample.png';
import { theme } from '../../constants/theme';
import {
  SubtitleS,
  ParagraphM,
  ParagraphXS,
  ParagraphXXS,
} from '../../components/_generic/typography/typography.styled';
import { ButtonOutline, ButtonGhost } from '../../components/_generic/button/button.styled';
import { Card } from '../../components/_generic/card/card.styled';
import Loading from '../../components/_generic/loading/loading';
import { Page } from '../../components/_generic/layout/layout.styled';
import Header from '../../components/_generic/header/header';
import { Navigation } from './components/navigation/navigation';
import { Table } from '../../components/_generic/table/table';
import { IndexStyled } from './index-route.styled';
import { tableColumns } from './fixtures/table-fixture';
import { tableData } from './constants/table-data';

export const DashboardRoute: FC = () => {
  const { t } = useTranslation();

  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  const [revealCardData, setRevealCardData] = useState(false);

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

  if (queryResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  // if (queryResponse.state === RequestState.SUCCESS) {
  //   if (!queryResponse.data.completed) {
  //     return <Navigate to="/onboarding" />;
  //   }
  // }

  const name = 'Lando';
  const date = 'February, 2022';

  return (
    <>
      <Header maxWidth="100%" />
      <Page>
        <IndexStyled>
          <Navigation />
          <div className="content">
            <SubtitleS className="title">{t('dashboard.title', { name })}</SubtitleS>
            <ParagraphXS color={theme.textSecondary} className="subtitle">
              {t('dashboard.subtitle', { date })}
            </ParagraphXS>

            <div className="section-cards">
              <Card backgroundImage={imgCard} onClick={() => setRevealCardData(!revealCardData)}>
                {revealCardData ? (
                  <div className="card-data">
                    <div>3443 6546 6457 8021</div>
                    <div>EXP 09/12 CVV 675</div>
                  </div>
                ) : (
                  <div className="card-data">
                    <div>•••• •••• •••• 8021</div>
                    <div>EXP ••/••CVV •••</div>
                  </div>
                )}
                <div className="card-status">Active</div>
              </Card>
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
                  <img src={imgCharSample} width="216" />
                </div>
              </Card>
            </div>

            <div className="section-cards">
              <Card padding="1.5rem">
                <div className="card-group">
                  <ParagraphXS weight={700} className="card-title">
                    Collateral Value
                  </ParagraphXS>
                  <SubtitleS weight={400} className="card-info">
                    $10,000
                  </SubtitleS>
                  <div className="btn-group">
                    <ButtonOutline maxWidth="auto" small>
                      Add
                    </ButtonOutline>
                    <ButtonGhost maxWidth="auto" small>
                      Redeem
                    </ButtonGhost>
                  </div>
                </div>
              </Card>
              <Card padding="1.5rem">
                <div className="card-group">
                  <ParagraphXS weight={700} className="card-title">
                    Next Payment
                  </ParagraphXS>
                  <SubtitleS weight={400} className="card-info">
                    June 3
                  </SubtitleS>
                  <ButtonOutline maxWidth="auto" small>
                    Pay now
                  </ButtonOutline>
                </div>
              </Card>
              <Card padding="1.5rem">
                <div className="card-group">
                  <ParagraphXS weight={700} className="card-title">
                    My Rewards
                  </ParagraphXS>
                  <SubtitleS weight={400} className="card-info">
                    1,801
                  </SubtitleS>
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
                <ButtonOutline maxWidth="auto" small className="table-btn">
                  View More
                </ButtonOutline>
                <Table columns={columns} data={data} />
              </Card>
            </div>
          </div>
        </IndexStyled>
      </Page>
    </>
  );
};
