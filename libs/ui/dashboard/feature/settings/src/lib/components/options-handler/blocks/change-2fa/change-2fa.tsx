import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetOnboarding } from '@archie/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';
import { useGetMfaEnrollments } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-mfa-enrollments';
import { useRemoveMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-remove-mfa-enrollment';
import { useStartMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-start-mfa-enrollment';

import { Change2faConfirmationModal } from '../../../modals/change-2fa-confirmation/change-2fa-confirmation';
import { OptionsItem } from '../../../options-item/options-item';

export const Change2FA: FC = () => {
  const { t } = useTranslation();

  const [mfaEnrollmentId, setMfaEndollmentId] = useState('');
  const [change2faConfirmatinModalOpen, setChange2faConfirmatinModalOpen] = useState(false);

  const getOnboardinResponse = useGetOnboarding();
  const getMfaEnrollmentsResponse = useGetMfaEnrollments();
  const removeMfaEnrollmentMutation = useRemoveMfaEnrollment(mfaEnrollmentId);
  const startMfaEnrollmentMutation = useStartMfaEnrollment();

  const isMfaSet = getOnboardinResponse.state === RequestState.SUCCESS && getOnboardinResponse.data.mfaEnrollmentStage;

  useEffect(() => {
    if (isMfaSet) {
      if (getMfaEnrollmentsResponse.state === RequestState.SUCCESS) {
        setMfaEndollmentId(getMfaEnrollmentsResponse.data[0].id);
      }
    }
  }, [isMfaSet, getMfaEnrollmentsResponse]);

  console.log(removeMfaEnrollmentMutation.state);

  useEffect(() => {
    if (removeMfaEnrollmentMutation.state === RequestState.SUCCESS) {
      if (startMfaEnrollmentMutation.state === RequestState.IDLE) {
        startMfaEnrollmentMutation.mutate({});
      }

      if (startMfaEnrollmentMutation.state === RequestState.SUCCESS) {
        window.open(startMfaEnrollmentMutation.data.ticket_url, '_blank');
      }
    }
  }, [removeMfaEnrollmentMutation.state, startMfaEnrollmentMutation.state]);

  const handleClick = () => {
    if (mfaEnrollmentId) {
      if (
        removeMfaEnrollmentMutation.state === RequestState.IDLE ||
        // ni prav da se klice on SUCCESS state. kako lahko dosezemo da je spet nazaj IDLE
        removeMfaEnrollmentMutation.state === RequestState.SUCCESS
      ) {
        removeMfaEnrollmentMutation.mutate({});
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
