import { FC, useMemo } from 'react';
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
import { Table } from './components/table/table';
import { IndexStyled } from './index-route.styled';

export const DashboardRoute: FC = () => {
  const { t } = useTranslation();

  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  const columns = useMemo(
    () => [
      {
        Header: 'Header',
        columns: [
          {
            Header: 'Column 1',
            accessor: 'col1',
          },
          {
            Header: 'Column 2',
            accessor: 'col2',
          },
        ],
      },
    ],
    [],
  );

  const data = useMemo(
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],
    [],
  );

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
            <ParagraphM weight={800} className="title">
              {t('dashboard.title', { name })}
            </ParagraphM>
            <ParagraphXXS color={theme.textSecondary} className="subtitle">
              {t('dashboard.subtitle', { date })}
            </ParagraphXXS>

            <div className="section-cards">
              <Card>
                <img src={imgCard} />
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
                    <ParagraphXS color={theme.textSecondary} weight={500} className="card-text">
                      Line of Credit: $5,000.00
                    </ParagraphXS>
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
              <Card column alignItems="flex-start" padding="1.5rem">
                <ParagraphM weight={800} className="table-title">
                  Recent Transactions
                </ParagraphM>
                <ButtonOutline maxWidth="auto" small className="table-title">
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
