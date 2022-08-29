import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NextPaymentChart, MakePaymentModal } from '@archie-webapps/archie-dashboard/components';
import { ButtonOutline, Card, Loader, ParagraphXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import {
  CREDIT_LINE_NOT_FOUND_ERROR,
  MISSING_PAYMENT_INFO_ERROR,
} from '@archie-webapps/shared/data-access/archie-api/payment/payment.interfaces';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Navigate } from 'react-router-dom';
import { OBLIGATION_DATE_FORMAT } from '@archie-webapps/shared/data-access/archie-api/payment/payment.constants';
import { format, parse } from 'date-fns';

interface NextPaymentProps {
  withBtn?: boolean;
}

export const NextPayment: FC<NextPaymentProps> = ({ withBtn }) => {
  const { t } = useTranslation();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);
  const getObligationsResponse = useGetObligations();

  function getContent() {
    if (getObligationsResponse.state === RequestState.LOADING) {
      return <Loader className="loader" />;
    }

    if (getObligationsResponse.state === RequestState.ERROR) {
      if (
        getObligationsResponse.error.name === CREDIT_LINE_NOT_FOUND_ERROR ||
        getObligationsResponse.error.name === MISSING_PAYMENT_INFO_ERROR
      ) {
        return (
          <SubtitleS weight={400} className="card-info">
            {t('next_payment.no_payment_due')}
          </SubtitleS>
        );
      }

      return <Navigate to="/error" state={{ prevPath: '/' }} />;
    }

    if (getObligationsResponse.state === RequestState.SUCCESS) {
      const dueDateParsed = parse(getObligationsResponse.data.dueDate, OBLIGATION_DATE_FORMAT, new Date());

      return (
        <>
          <SubtitleS weight={400} className="card-info">
            {format(dueDateParsed, 'MMMM do')}
          </SubtitleS>
          <NextPaymentChart dueDate={dueDateParsed} />
          {withBtn && (
            <div className="btn-group">
              <ButtonOutline small onClick={() => setMakePaymentModalOpen(true)}>
                {t('next_payment_card.btn')}
              </ButtonOutline>
            </div>
          )}
        </>
      );
    }

    return <></>;
  }

  return (
    <>
      <Card column alignItems="flex-start" padding="1.5rem">
        <ParagraphXS weight={700} className="card-title">
          {t('next_payment_card.title')}
        </ParagraphXS>
        {getContent()}
      </Card>
      {makePaymentModalOpen && <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />}
    </>
  );
};
