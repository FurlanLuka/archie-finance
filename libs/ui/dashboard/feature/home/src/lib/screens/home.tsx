import { format, parseISO } from 'date-fns';
import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import {
  ArchieCard,
  AvailableCredit,
  CollateralValue,
  NextPayment,
  MarginCallAlert,
} from '@archie/ui/dashboard/components';
import { PayWithPaypalScheduled } from '@archie/ui/dashboard/feature/make-payment';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetKyc } from '@archie/ui/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { Modal, TitleM, BodyM } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { RecentTransactions } from '../components/recent-transactions/recent-transactions';

import { HomeStyled } from './home.styled';

export const HomeScreen: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const getKycResponse = useGetKyc();

  const [confirmPaymentModalOpen, setConfirmPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (token !== null) {
      setConfirmPaymentModalOpen(true);
    }
  }, [token]);

  const handleConfirmPaymentModaConfirm = () => {
    setConfirmPaymentModalOpen(false);
    navigate('/');
  };

  const getTitle = () => {
    if (getKycResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/home' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS) {
      const kycData = getKycResponse.data;

      const getDate = () => format(parseISO(kycData.createdAt), 'MMMM, yyyy');

      return (
        <>
          <TitleM className="title">
            {t('dashboard_home.title', { name: kycData.firstName })}
          </TitleM>
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
        <MarginCallAlert withButton />
        <div className="section-title">{getTitle()}</div>
        <div className="section-cards one">
          <ArchieCard />
          <AvailableCredit />
        </div>
        <div className="section-cards two">
          <CollateralValue />
          <NextPayment withBtn />
          {/* <Rewards /> */}
        </div>
        <div className="section-table">
          <RecentTransactions />
        </div>
      </HomeStyled>
      {confirmPaymentModalOpen && (
        <Modal
          maxWidth="780px"
          isOpen
          close={() => setConfirmPaymentModalOpen(false)}
        >
          <PayWithPaypalScheduled onConfirm={handleConfirmPaymentModaConfirm} />
        </Modal>
      )}
    </>
  );
};
