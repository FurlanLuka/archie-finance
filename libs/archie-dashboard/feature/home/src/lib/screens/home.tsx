import { FC, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import {
  ArchieCard,
  AvailableCredit,
  CollateralValue,
  NextPayment,
  MyRewards,
} from '@archie-webapps/archie-dashboard/components';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Kyc } from '@archie-webapps/shared/data-access/archie-api/kyc/api/get-kyc';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { PayWithPaypalScheduled } from '@archie-webapps/archie-dashboard/feature/make-payment';
import { Modal, TitleM, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { MarginCallAlert } from '../components/alerts/margin-call/margin-call';
import { RecentTransactions } from '../components/recent-transactions/recent-transactions';

import { HomeStyled } from './home.styled';

export const HomeScreen: FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const getKycResponse: QueryResponse<Kyc> = useGetKyc();

  const [confirmPaymentModalOpen, setConfirmPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (token !== null) {
      setConfirmPaymentModalOpen(true);
    }
  }, [token]);

  const getTitle = () => {
    if (getKycResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/home' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS) {
      const kycData = getKycResponse.data;

      const getDate = () => format(parseISO(kycData.createdAt), 'MMMM, yyyy');

      return (
        <>
          <TitleM className="title">{t('dashboard_home.title', { name: kycData.firstName })}</TitleM>
          <BodyM color={theme.textSecondary} className="subtitle">
            {t('dashboard_home.subtitle', { date: getDate() })}
          </BodyM>
        </>
      );
    }

    return <></>;
  };

  return (
    <>
      <HomeStyled>
        <MarginCallAlert />
        <div className="section-title">{getTitle()}</div>
        <div className="section-cards one">
          <ArchieCard />
          <AvailableCredit />
        </div>
        <div className="section-cards two">
          <CollateralValue />
          <NextPayment withBtn />
          {/* <MyRewards /> */}
        </div>
        <div className="section-table">
          <RecentTransactions />
        </div>
      </HomeStyled>
      {confirmPaymentModalOpen && (
        <Modal maxWidth="780px" isOpen close={close}>
          <PayWithPaypalScheduled onConfirm={() => setConfirmPaymentModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};
