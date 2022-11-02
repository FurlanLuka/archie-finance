import { BigNumber } from 'bignumber.js';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { MakePaymentModal } from '@archie/ui/dashboard/feature/make-payment';
import { canUserSchedulePayment } from '@archie/ui/dashboard/utils';
import { useGetLTV } from '@archie/ui/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { useGetCredit } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetObligations } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-obligations';
import { ButtonOutline, Card, Skeleton, TitleM, BodyM, BodyS } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { LoanToValueChart } from '../../charts/loan-to-value/loan-to-value';

export const AvailableCredit: FC = () => {
  const { t } = useTranslation();

  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);

  const getCreditResponse = useGetCredit();
  const getLTVResponse = useGetLTV();
  const getObligationsResponse = useGetObligations();

  if (
    getCreditResponse.state === RequestState.LOADING ||
    getLTVResponse.state === RequestState.LOADING ||
    getObligationsResponse.state === RequestState.LOADING
  ) {
    return (
      <Card>
        <Skeleton />
      </Card>
    );
  }

  if (getCreditResponse.state === RequestState.ERROR || getLTVResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/home' }} />;
  }

  if (getCreditResponse.state === RequestState.SUCCESS && getLTVResponse.state === RequestState.SUCCESS) {
    const creditData = getCreditResponse.data;
    const ltvData = getLTVResponse.data;

    return (
      <>
        <Card justifyContent="space-between" columnReverse padding="1.5rem" status={ltvData.status}>
          <div className="card-group">
            <div className="card-group p-bottom">
              <BodyM weight={700} className="card-title">
                {t('available_credit_card.title_1')}
              </BodyM>
              <TitleM weight={400} className="card-info border-active">
                ${BigNumber(creditData.utilizationAmount).decimalPlaces(2, BigNumber.ROUND_DOWN).toString()}
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
                ${BigNumber(creditData.availableCredit).decimalPlaces(2, BigNumber.ROUND_DOWN).toString()}
              </TitleM>
              <BodyS color={theme.textSecondary} weight={500} className="card-text">
                {t('available_credit_card.text', {
                  lineOfCredit: BigNumber(creditData.totalCredit).decimalPlaces(2, BigNumber.ROUND_DOWN).toString(),
                })}
              </BodyS>
            </div>
          </div>
          <div className="card-group p-bottom-sm">
            <LoanToValueChart ltv={ltvData.ltv} status={ltvData.status} />
          </div>
        </Card>
        {makePaymentModalOpen && <MakePaymentModal close={() => setMakePaymentModalOpen(false)} />}
      </>
    );
  }

  return <></>;
};
