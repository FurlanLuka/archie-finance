import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import {
  QueryResponse,
  RequestState,
} from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetKyc } from '@archie/ui/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { EmailVerificationResponse } from '@archie/ui/shared/data-access/archie-api/user/api/get-email-verification';
import { useGetEmailVerification } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import {
  Card,
  Skeleton,
  TitleM,
  TitleS,
  BodyM,
} from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { OptionsHandler } from '../components/options-handler/options-handler';

import { SettingsStyled } from './settings.styled';

export const SettingsScreen: FC = () => {
  const { t } = useTranslation();

  const getKycResponse = useGetKyc();
  const getEmailVerificationResponse: QueryResponse<EmailVerificationResponse> =
    useGetEmailVerification();

  const getContent = () => {
    if (
      getKycResponse.state === RequestState.LOADING ||
      getEmailVerificationResponse.state === RequestState.LOADING
    ) {
      return (
        <Card height="615px">
          <Skeleton />
        </Card>
      );
    }

    if (
      getKycResponse.state === RequestState.ERROR ||
      getEmailVerificationResponse.state === RequestState.ERROR
    ) {
      return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
    }

    if (
      getKycResponse.state === RequestState.SUCCESS &&
      getEmailVerificationResponse.state === RequestState.SUCCESS
    ) {
      const kycData = getKycResponse.data;
      const emailVerificationData = getEmailVerificationResponse.data;

      return (
        <Card column alignItems="flex-start" padding="1.5rem 1.5rem 2rem">
          <div className="subtitle">
            <TitleS className="name">
              {kycData.firstName} {kycData.lastName}
            </TitleS>
            <BodyM color={theme.textSecondary} className="email">
              {emailVerificationData.email}
            </BodyM>
          </div>
          <OptionsHandler />
        </Card>
      );
    }

    return <></>;
  };

  return (
    <SettingsStyled>
      <TitleM className="title">{t('dashboard_settings.title')}</TitleM>
      {getContent()}
    </SettingsStyled>
  );
};
