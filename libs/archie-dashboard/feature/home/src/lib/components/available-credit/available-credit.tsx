import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { GetCreditResponse } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, Card, ParagraphXS, ParagraphXXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { LoanToValueChart } from '../charts/loan-to-value/loan-to-value';

export const AvailableCredit: FC = () => {
  const { t } = useTranslation();

  const getCreditQueryResponse: QueryResponse<GetCreditResponse> = useGetCredit();

  const getCredit = () => {
    if (getCreditQueryResponse.state === RequestState.SUCCESS) {
      return getCreditQueryResponse.data;
    }

    return { totalCredit: 0, availableCredit: 0 };
  };

  return (
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
        <LoanToValueChart />
      </div>
    </Card>
  );
};
