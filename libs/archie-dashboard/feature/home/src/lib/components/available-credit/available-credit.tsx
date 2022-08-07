import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { GetCreditResponse } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, Card, ParagraphXS, ParagraphXXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { LoanToValueChart } from '../charts/loan-to-value/loan-to-value';

export const AvailableCredit: FC = () => {
  const { t } = useTranslation();

  const getCreditQueryResponse: QueryResponse<GetCreditResponse> = useGetCredit();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();

  if (getCreditQueryResponse.state === RequestState.LOADING || getLTVResponse.state === RequestState.LOADING) {
    return (
      <Card>
        <div className="skeleton"></div>
      </Card>
    );
  }

  if (getCreditQueryResponse.state === RequestState.ERROR || getLTVResponse.state === RequestState.ERROR) {
    return <div>Something went wrong :(</div>; // TODO: replace with error state
  }

  if (getCreditQueryResponse.state === RequestState.SUCCESS && getLTVResponse.state === RequestState.SUCCESS) {
    const creditData = getCreditQueryResponse.data;
    const ltvData = getLTVResponse.data;

    return (
      <Card justifyContent="space-between" columnReverse padding="1.5rem">
        <div className="card-group">
          <div className="card-group p-bottom">
            <ParagraphXS weight={700} className="card-title">
              ArchCredit Balance
            </ParagraphXS>
            <SubtitleS weight={400} className="card-info border-active">
              ${getFormattedValue(creditData.totalCredit - creditData.availableCredit)}
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
              ${getFormattedValue(creditData.availableCredit)}
            </SubtitleS>
            <ParagraphXXS color={theme.textSecondary} weight={500} className="card-text">
              Line of Credit: ${getFormattedValue(creditData.totalCredit)}
            </ParagraphXXS>
          </div>
        </div>
        <div className="card-group p-bottom-sm">
          <LoanToValueChart ltv={ltvData.ltv} status={ltvData.status} />
        </div>
      </Card>
    );
  }

  return <></>;
};
