import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetOnboarding } from '@archie/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { useGetMfaEnrollments } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-mfa-enrollments';
import { useRemoveMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-remove-mfa-enrollment';
import { queryClient } from '@archie/ui/shared/data-access/query-client';

import { Change2faConfirmationModal } from '../../../modals/change-2fa-confirmation/change-2fa-confirmation';
import { OptionsItem } from '../../../options-item/options-item';

export const Change2FA: FC = () => {
  const { t } = useTranslation();

  const [change2faConfirmatinModalOpen, setChange2faConfirmatinModalOpen] = useState(false);

  const getOnboardinResponse = useGetOnboarding();
  const getMfaEnrollmentsResponse = useGetMfaEnrollments();
  const removeMfaEnrollmentMutation = useRemoveMfaEnrollment();

  const isMfaSet = getOnboardinResponse.state === RequestState.SUCCESS && getOnboardinResponse.data.mfaEnrollmentStage;
  console.log('borda', getMfaEnrollmentsResponse);

  useEffect(() => {
    console.log('mfa set change', isMfaSet);
    queryClient.invalidateQueries('mfa_enrollments_record');
  }, [isMfaSet]);

  const handleClick = () => {
    if (getMfaEnrollmentsResponse.state === RequestState.SUCCESS && getMfaEnrollmentsResponse.data.length > 0) {
      if (
        removeMfaEnrollmentMutation.state === RequestState.IDLE ||
        removeMfaEnrollmentMutation.state === RequestState.SUCCESS
      ) {
        removeMfaEnrollmentMutation.mutate({ mfaEnrollmentId: getMfaEnrollmentsResponse.data[0].id });
        setChange2faConfirmatinModalOpen(false);
      }
    }
  };

  return (
    <>
      <OptionsItem
        title={t('dashboard_settings.2fa.title')}
        onClick={() => setChange2faConfirmatinModalOpen(true)}
        isDisabled={!isMfaSet}
      />
      <Change2faConfirmationModal
        isOpen={change2faConfirmatinModalOpen}
        onConfirm={handleClick}
        close={() => setChange2faConfirmatinModalOpen(false)}
      />
    </>
  );
};
