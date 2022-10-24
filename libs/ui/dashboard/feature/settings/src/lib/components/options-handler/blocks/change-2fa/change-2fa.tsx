import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetMfaEnrollments } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-mfa-enrollments';
import { useRemoveMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-remove-mfa-enrollment';
import { useStartMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-start-mfa-enrollment';

import { Change2faConfirmationModal } from '../../../modals/change-2fa-confirmation/change-2fa-confirmation';
import { OptionsItem } from '../../../options-item/options-item';

export const Change2FA: FC = () => {
  const { t } = useTranslation();

  const [mfaEnrollmentId, setMfaEndollmentId] = useState('');
  const [change2faConfirmatinModalOpen, setChange2faConfirmatinModalOpen] = useState(false);

  const startMfaEnrollmentMutation = useStartMfaEnrollment();
  const getMfaEnrollmentsResponse = useGetMfaEnrollments();
  const removeMfaEnrollmentMutation = useRemoveMfaEnrollment(mfaEnrollmentId);

  useEffect(() => {
    if (getMfaEnrollmentsResponse.state === RequestState.SUCCESS) {
      setMfaEndollmentId(getMfaEnrollmentsResponse.data[0].id);
    }
  }, [getMfaEnrollmentsResponse.state]);

  useEffect(() => {
    if (startMfaEnrollmentMutation.state === RequestState.SUCCESS) {
      window.open(startMfaEnrollmentMutation.data.ticket_url, '_blank');
    }
  }, [startMfaEnrollmentMutation.state]);

  const handleClick = () => {
    if (mfaEnrollmentId) {
      if (removeMfaEnrollmentMutation.state === RequestState.IDLE) {
        removeMfaEnrollmentMutation.mutate({});
      }
    }

    if (startMfaEnrollmentMutation.state === RequestState.IDLE) {
      startMfaEnrollmentMutation.mutate({});
      setChange2faConfirmatinModalOpen(false);
    }

    if (startMfaEnrollmentMutation.state === RequestState.SUCCESS) {
      window.open(startMfaEnrollmentMutation.data.ticket_url, '_blank');
    }
  };

  return (
    <>
      <OptionsItem title={t('dashboard_settings.2fa.title')} onClick={() => setChange2faConfirmatinModalOpen(true)} />
      <Change2faConfirmationModal
        isOpen={change2faConfirmatinModalOpen}
        onConfirm={handleClick}
        close={() => setChange2faConfirmatinModalOpen(false)}
      />
    </>
  );
};
