import { FC, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { NextPaymentChart, MakePaymentModal } from '@archie-webapps/archie-dashboard/components';
import { ButtonOutline, Card, Skeleton, TitleM, BodyM } from '@archie-webapps/shared/ui/design-system';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import {
  CREDIT_LINE_NOT_FOUND_ERROR,
  MISSING_PAYMENT_INFO_ERROR,
  UserObligations,
} from '@archie-webapps/shared/data-access/archie-api/payment/payment.interfaces';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';

interface NextPaymentProps {
  withBtn?: boolean;
}

export const NextPayment: FC<NextPaymentProps> = ({ withBtn }) => {
  const { t } = useTranslation();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);

  const getObligationsResponse: QueryResponse<UserObligations> = useGetObligations();

  const getContent = () => {
    if (getObligationsResponse.state === RequestState.LOADING) {
      return (
        <Card>
          <Skeleton />
        </Card>
      );
    }

    if (getObligationsResponse.state === RequestState.ERROR) {
      if (
        getObligationsResponse.error.name === CREDIT_LINE_NOT_FOUND_ERROR ||
        getObligationsResponse.error.name === MISSING_PAYMENT_INFO_ERROR
      ) {
        return (
          <Card column alignItems="flex-start" padding="1.5rem">
            <BodyM weight={700} className="card-title">
              {t('next_payment_card.title')}
            </BodyM>
            <TitleM weight={400} className="card-info">
              {t('next_payment.no_payment_due')}
            </TitleM>
          </Card>
        );
      }

      return <Navigate to="/error" state={{ prevPath: '/' }} />;
    }

    if (getObligationsResponse.state === RequestState.SUCCESS) {
      const { dueDate } = getObligationsResponse.data;

      return (
        <Card column alignItems="flex-start" padding="1.5rem">
          <BodyM weight={700} className="card-title">
            {t('next_payment_card.title')}
          </BodyM>
          <TitleM weight={400} className="card-info">
            {format(dueDate, 'MMM, do')}
          </TitleM>
          <NextPaymentChart dueDate={dueDate} />
          {withBtn && (
            <div className="btn-group">
              <ButtonOutline small onClick={() => setMakePaymentModalOpen(true)}>
                {t('next_payment_card.btn')}
              </ButtonOutline>
            </div>
          )}
        </Card>
      );
    }

    return <></>;
  };

  return (
    <>
      {getContent()}
      {makePaymentModalOpen && <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />}
    </>
  );
};
