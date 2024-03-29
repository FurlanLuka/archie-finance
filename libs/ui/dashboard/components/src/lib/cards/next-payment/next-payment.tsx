import { format } from 'date-fns';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { MakePaymentModal } from '@archie/ui/dashboard/feature/make-payment';
import { canUserSchedulePayment } from '@archie/ui/dashboard/utils';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import {
  CREDIT_LINE_NOT_FOUND_ERROR,
  MISSING_PAYMENT_INFO_ERROR,
} from '@archie/ui/shared/data-access/archie-api/payment/api/get-obligations';
import { useGetObligations } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import {
  ButtonOutline,
  Card,
  Skeleton,
  TitleM,
  BodyM,
} from '@archie/ui/shared/design-system';

import { NextPaymentChart } from '../../charts/next-payment/next-payment';

interface NextPaymentProps {
  withBtn?: boolean;
}

export const NextPayment: FC<NextPaymentProps> = ({ withBtn }) => {
  const { t } = useTranslation();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);

  const getObligationsResponse = useGetObligations();

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
            {t('next_payment_card.no_payment_due')}
          </TitleM>
        </Card>
      );
    }

    return <Navigate to="/error" state={{ prevPath: '/' }} />;
  }

  if (getObligationsResponse.state === RequestState.SUCCESS) {
    const { dueDate } = getObligationsResponse.data;

    return (
      <>
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
              <ButtonOutline
                small
                onClick={() => setMakePaymentModalOpen(true)}
                isDisabled={
                  getObligationsResponse.state === RequestState.SUCCESS &&
                  !canUserSchedulePayment(getObligationsResponse.data)
                }
              >
                {t('next_payment_card.btn')}
              </ButtonOutline>
            </div>
          )}
        </Card>
        {makePaymentModalOpen && (
          <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />
        )}
      </>
    );
  }

  return <></>;
};
