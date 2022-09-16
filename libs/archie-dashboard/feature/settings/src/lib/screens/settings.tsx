import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { EmailVerificationResponse } from '@archie-webapps/shared/data-access/archie-api/user/api/get-email-verification';
import { useGetEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import { Kyc } from '@archie-webapps/shared/data-access/archie-api/kyc/api/get-kyc';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { Card, TitleM, BodyM, BodyL, BodyS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { AutopayModal } from '../components/modals/autopay/autopay';
import { SettingsStyled } from './settings.styled';

export const SettingsScreen: FC = () => {
  const { t } = useTranslation();
  const getKycResponse: QueryResponse<Kyc> = useGetKyc();
  const getEmailVerificationResponse: QueryResponse<EmailVerificationResponse> = useGetEmailVerification();

  const [autopayModalOpen, setAutopayModalOpen] = useState(false);

  const getTitle = () => {
    if (getKycResponse.state === RequestState.ERROR || getEmailVerificationResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS && getEmailVerificationResponse.state === RequestState.SUCCESS) {
      const kycData = getKycResponse.data;
      const emailVerificationData = getEmailVerificationResponse.data;

      return (
        <>
          <TitleM className="title">{t('dashboard_settings.title')}</TitleM>
          <BodyM color={theme.textSecondary} className="subtitle">
            {kycData.firstName} {kycData.lastName}, {emailVerificationData.email}
          </BodyM>
        </>
      );
    }

    return <></>;
  };

  return (
    <>
      <SettingsStyled>
        <div className="section-title">{getTitle()}</div>
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem" minHeight="450px">
          <button className="btn-autopay" onClick={() => setAutopayModalOpen(true)}>
            <BodyL weight={600}>Autopay Settings</BodyL>
          </button>
          <BodyS color={theme.textSecondary}>Autopay is currently on</BodyS>
        </Card>
      </SettingsStyled>
      {/* if user has not yet connected with plaid, call that modal fist */}
      {autopayModalOpen && <AutopayModal close={() => setAutopayModalOpen(false)} />}
    </>
  );
};
