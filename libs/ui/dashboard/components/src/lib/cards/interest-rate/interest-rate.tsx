import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { useGetLoanInterests } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-get-loan-interests';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { Card, Skeleton, TitleM, BodyM } from '@archie/ui/shared/design-system';

export const InterestRate: FC = () => {
  const { t } = useTranslation();

  const getLoanInterestsResponse = useGetLoanInterests();

  if (getLoanInterestsResponse.state === RequestState.LOADING) {
    return (
      <Card minHeight="107px">
        <Skeleton />
      </Card>
    );
  }

  if (getLoanInterestsResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
  }

  if (getLoanInterestsResponse.state === RequestState.SUCCESS) {
    const loanInterestsData = getLoanInterestsResponse.data;

    return (
      <Card
        column
        alignItems="flex-start"
        justifyContent="space-between"
        padding="1.5rem"
      >
        <BodyM weight={700} className="card-title">
          {t('interest_rate_card.title')}
        </BodyM>
        <TitleM weight={400} className="card-info">
          {loanInterestsData.aprEffective * 100}%
        </TitleM>
      </Card>
    );
  }

  return <></>;
};
