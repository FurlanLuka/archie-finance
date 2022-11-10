import { FC, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MutationState, RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetOnboarding } from '@archie/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import {
  useGetMfaEnrollments,
  MFA_ENROLLMENTS_RECORD_QUERY_KEY,
} from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-mfa-enrollments';
import { useRemoveMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-remove-mfa-enrollment';
import { useStartMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-start-mfa-enrollment';
import { queryClient } from '@archie/ui/shared/data-access/query-client';

import { Change2faConfirmationModal } from '../../../modals/change-2fa-confirmation/change-2fa-confirmation';
import { OptionsItem } from '../../../options-item/options-item';

export const Change2FA: FC = () => {
  const { t } = useTranslation();

  const [change2faConfirmationModalOpen, setChange2faConfirmationModalOpen] =
    useState(false);

  const getOnboardingResponse = useGetOnboarding();
  const getMfaEnrollmentsResponse = useGetMfaEnrollments();
  const removeMfaEnrollmentMutation = useRemoveMfaEnrollment();
  const startMfaEnrollmentMutation = useStartMfaEnrollment();

  const isMfaSet = useMemo(
    () =>
      getOnboardingResponse.state === RequestState.SUCCESS &&
      getOnboardingResponse.data.mfaEnrollmentStage,
    [getOnboardingResponse],
  );

  useEffect(() => {
    queryClient.invalidateQueries(MFA_ENROLLMENTS_RECORD_QUERY_KEY);
  }, [isMfaSet]);

  useEffect(() => {
    if (removeMfaEnrollmentMutation.state === MutationState.SUCCESS) {
      if (startMfaEnrollmentMutation.state === MutationState.IDLE) {
        startMfaEnrollmentMutation.mutate({});
      }

      if (startMfaEnrollmentMutation.state === MutationState.SUCCESS) {
        window.open(startMfaEnrollmentMutation.data.ticket_url, '_blank');
      }
    }
  }, [removeMfaEnrollmentMutation, startMfaEnrollmentMutation]);

  const handleClick = () => {
    if (
      getMfaEnrollmentsResponse.state === RequestState.SUCCESS &&
      getMfaEnrollmentsResponse.data.length > 0
    ) {
      if (
        removeMfaEnrollmentMutation.state === MutationState.IDLE ||
        removeMfaEnrollmentMutation.state === MutationState.SUCCESS
      ) {
        removeMfaEnrollmentMutation.mutate({
          mfaEnrollmentId: getMfaEnrollmentsResponse.data[0].id,
        });
        setChange2faConfirmationModalOpen(false);
      }
    }
  };

  return (
    <>
      <OptionsItem
        title={t('dashboard_settings.2fa.title')}
        onClick={() => setChange2faConfirmationModalOpen(true)}
        isDisabled={!isMfaSet}
      />
      <Change2faConfirmationModal
        isOpen={change2faConfirmationModalOpen}
        onConfirm={handleClick}
        close={() => setChange2faConfirmationModalOpen(false)}
      />
    </>
  );
};
