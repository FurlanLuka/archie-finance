import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetKyc } from '@archie/ui/shared/data-access/archie-api/kyc/hooks/use-get-kyc';
import { useGetEmailVerification } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-email-verification';
import { Card, Skeleton, TitleM, TitleS, BodyM } from '@archie/ui/shared/design-system';

import { OptionsHandler } from '../components/options-handler/options-handler';

import { SettingsStyled } from './settings.styled';

export const SettingsScreen: FC = () => {
  const { t } = useTranslation();

  const getKycResponse = useGetKyc();
  const getEmailVerificationResponse = useGetEmailVerification();

  const getContent = () => {
    if (getKycResponse.state === RequestState.LOADING || getEmailVerificationResponse.state === RequestState.LOADING) {
      return (
        <Card height="608px">
          <Skeleton />
        </Card>
      );
    }

    if (getKycResponse.state === RequestState.ERROR || getEmailVerificationResponse.state === RequestState.ERROR) {
      return <Navigate to="/error" state={{ prevPath: '/settings' }} />;
    }

    if (getKycResponse.state === RequestState.SUCCESS && getEmailVerificationResponse.state === RequestState.SUCCESS) {
      const kycData = getKycResponse.data;
      const emailVerificationData = getEmailVerificationResponse.data;

      return (
        <Card column alignItems="flex-start" padding="1.5rem 1.5rem 2rem">
          <div className="subtitle">
            <TitleS className="name">
              {kycData.firstName} {kycData.lastName}
            </TitleS>
            <BodyM weight={500} className="email">
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
