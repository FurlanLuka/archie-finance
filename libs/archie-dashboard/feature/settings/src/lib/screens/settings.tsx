import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Kyc } from '@archie-webapps/shared/data-access/archie-api/kyc/api/get-kyc';
import { useGetKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { EmailVerificationResponse } from '@archie-webapps/shared/data-access/archie-api/user/api/get-email-verification';
import { useGetEmailVerification } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import { Card, TitleM, TitleS, BodyM, Loader } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { Options } from '../components/options/options';

import { SettingsStyled } from './settings.styled';

export const SettingsScreen: FC = () => {
  const { t } = useTranslation();
  const getKycResponse: QueryResponse<Kyc> = useGetKyc();
  const getEmailVerificationResponse: QueryResponse<EmailVerificationResponse> = useGetEmailVerification();

  const getContent = () => {
    if (getKycResponse.state === RequestState.LOADING || getEmailVerificationResponse.state === RequestState.LOADING) {
      return <Loader marginAuto />;
    }

    if (getKycResponse.state === RequestState.ERROR || getEmailVerificationResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS && getEmailVerificationResponse.state === RequestState.SUCCESS) {
      const kycData = getKycResponse.data;
      const emailVerificationData = getEmailVerificationResponse.data;

      return (
        <>
          <div className="subtitle">
            <TitleS className="name">
              {kycData.firstName} {kycData.lastName}
            </TitleS>
            <BodyM color={theme.textSecondary} className="email">
              {emailVerificationData.email}
            </BodyM>
          </div>
          <Options />
        </>
      );
    }

    return <></>;
  };

  return (
      <SettingsStyled>
        <TitleM className="title">{t('dashboard_settings.title')}</TitleM>
        <Card column alignItems="flex-start" padding="1.5rem 1.5rem 2rem" minHeight="615px">
          {getContent()}
        </Card>
      </SettingsStyled>
  );
};
