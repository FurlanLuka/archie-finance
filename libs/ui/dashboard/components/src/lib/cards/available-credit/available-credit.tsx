import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';

import { MakePaymentModal } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { LoanToValueChart } from '@archie-microservices/ui/dashboard/components';
import { canUserSchedulePayment } from '@archie-webapps/archie-dashboard/utils';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { GetCreditResponse } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import {
  QueryResponse,
  RequestState,
} from '@archie-webapps/shared/data-access/archie-api/interface';
import {
  ButtonOutline,
  Card,
  Skeleton,
  TitleM,
  BodyM,
  BodyS,
} from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';
import { useGetObligations } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-obligations';

export const AvailableCredit: FC = () => {
  const { t } = useTranslation();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);

  const getCreditQueryResponse: QueryResponse<GetCreditResponse> =
    useGetCredit();
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();
  const getObligationsResponse = useGetObligations();

  if (
    getCreditQueryResponse.state === RequestState.LOADING ||
    getLTVResponse.state === RequestState.LOADING ||
    getObligationsResponse.state === RequestState.LOADING
  ) {
    return (
      <Card>
        <Skeleton />
      </Card>
    );
  }

  if (
    getCreditQueryResponse.state === RequestState.ERROR ||
    getLTVResponse.state === RequestState.ERROR
  ) {
    return <Navigate to="/error" state={{ prevPath: '/home' }} />;
  }

  if (
    getCreditQueryResponse.state === RequestState.SUCCESS &&
    getLTVResponse.state === RequestState.SUCCESS
  ) {
    const creditData = getCreditQueryResponse.data;
    const ltvData = getLTVResponse.data;

    return (
      <>
        <Card
          justifyContent="space-between"
          columnReverse
          padding="1.5rem"
          status={ltvData.status}
        >
          <div className="card-group">
            <div className="card-group p-bottom">
              <BodyM weight={700} className="card-title">
                {t('available_credit_card.title_1')}
              </BodyM>
              <TitleM weight={400} className="card-info border-active">
                $
                {BigNumber(creditData.utilizationAmount)
                  .decimalPlaces(2, BigNumber.ROUND_DOWN)
                  .toString()}
              </TitleM>
              <div className="btn-group">
                <ButtonOutline
                  small
                  onClick={() => setMakePaymentModalOpen(true)}
                  isDisabled={
                    getObligationsResponse.state === RequestState.ERROR ||
                    (getObligationsResponse.state === RequestState.SUCCESS &&
                      !canUserSchedulePayment(getObligationsResponse.data))
                  }
                >
                  {t('available_credit_card.btn')}
                </ButtonOutline>
              </div>
            </div>
            <div className="card-group">
              <BodyM weight={700} className="card-title">
                {t('available_credit_card.title_2')}
              </BodyM>
              <TitleM weight={400} className="card-info border-default">
                $
                {BigNumber(creditData.availableCredit)
                  .decimalPlaces(2, BigNumber.ROUND_DOWN)
                  .toString()}
              </TitleM>
              <BodyS
                color={theme.textSecondary}
                weight={500}
                className="card-text"
              >
                {t('available_credit_card.text', {
                  lineOfCredit: BigNumber(creditData.totalCredit)
                    .decimalPlaces(2, BigNumber.ROUND_DOWN)
                    .toString(),
                })}
              </BodyS>
            </div>
          </div>
          <div className="card-group p-bottom-sm">
            <LoanToValueChart ltv={ltvData.ltv} status={ltvData.status} />
          </div>
        </Card>
        {makePaymentModalOpen && (
          <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />
        )}
      </>
    );
  }

  return <></>;
};
