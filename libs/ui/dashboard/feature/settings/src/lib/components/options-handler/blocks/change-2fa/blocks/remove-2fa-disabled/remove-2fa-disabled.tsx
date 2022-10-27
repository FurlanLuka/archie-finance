import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useStartMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-start-mfa-enrollment';

import { OptionsItem } from '../../../../../options-item/options-item';

export const Remove2FaDisabled: FC = () => {
  const { t } = useTranslation();

  const startMfaEnrollmentMutation = useStartMfaEnrollment();

  useEffect(() => {
    if (startMfaEnrollmentMutation.state === RequestState.IDLE) {
      startMfaEnrollmentMutation.mutate({});
    }

    if (startMfaEnrollmentMutation.state === RequestState.SUCCESS) {
      window.open(startMfaEnrollmentMutation.data.ticket_url, '_blank');
    }
  }, [startMfaEnrollmentMutation.state]);

  return <OptionsItem title={t('dashboard_settings.2fa.title')} isDisabled />;
};
