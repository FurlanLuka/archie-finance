import { Loader, ParagraphM, ParagraphS, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { Navigate } from 'react-router-dom';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { PaymentScheduleForm } from '../payment-schedule-form/payment-schedule-form';
import { PaymentScheduleStyled } from './payment-schedule.styled';

// Temp data
const name = 'Jovana';
const lastPayment = '6,640.54';
const date = 'May 23, 2022';

const mockBalances = {
  dueDate: '2022-09-24',
  balanceOwed: 1000,
  balanceWithInterest: 1200,
  fullBalance: 1237,
  interestOwed: 200,
};
interface PaymentScheduleProps {
  onConfirm: (amount: number, date: string) => void;
}

export const PaymentSchedule: FC<PaymentScheduleProps> = ({ onConfirm }) => {
  const { t } = useTranslation();
  const getKycResponse = useGetKyc();

  const getContent = () => {
    if (getKycResponse.state === RequestState.LOADING) {
      return <Loader className="loader" />;
    }

    if (getKycResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/payment' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS) {
      return (
        <>
          <ParagraphM weight={800} className="title">
            {t('payment_modal.payment_schedule.title')}
          </ParagraphM>
          <ParagraphS weight={600}>{t('payment_modal.payment_schedule.credit_for', { name })}</ParagraphS>
          <ParagraphXS>{t('payment_modal.payment_schedule.last_payment', { lastPayment, date })}</ParagraphXS>
          <ParagraphXS>
            {t('payment_modal.payment_schedule.interest_owed', { interestOwed: mockBalances.interestOwed })}
          </ParagraphXS>
          <div className="divider" />
          <PaymentScheduleForm onConfirm={onConfirm} balances={mockBalances} />
        </>
      );
    }

    return <></>;
  };

  return <PaymentScheduleStyled>{getContent()}</PaymentScheduleStyled>;
};
