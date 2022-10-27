import { FC } from 'react';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetOnboarding } from '@archie/ui/shared/data-access/archie-api/onboarding/hooks/use-get-onboarding';

import { Remove2FaActive } from 'libs/ui/dashboard/feature/settings/src/lib/components/options-handler/blocks/change-2fa/blocks/remove-2fa-active/remove-2fa-active';
import { Remove2FaDisabled } from 'libs/ui/dashboard/feature/settings/src/lib/components/options-handler/blocks/change-2fa/blocks/remove-2fa-disabled/remove-2fa-disabled';

export const Change2FA: FC = () => {
  const getOnboardinResponse = useGetOnboarding();

  const isMfaSet = getOnboardinResponse.state === RequestState.SUCCESS && getOnboardinResponse.data.mfaEnrollmentStage;

  return isMfaSet ? <Remove2FaActive /> : <Remove2FaDisabled />;
};
