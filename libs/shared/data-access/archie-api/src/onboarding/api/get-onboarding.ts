import { API_URL } from '@archie-webapps/shared/constants';

import { getRequest } from '../../helpers';

export interface GetOnboardingResponse {
  kycStage: boolean;
  emailVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  mfaEnrollmentStage: boolean;
  completed: boolean;
}

const ERROR_LIST = new Map([['ONBOARDING_NOT_FOUND', 'Onboarding record was not found. Please contact support.']]);

export const getOnboarding = async (accessToken: string): Promise<GetOnboardingResponse> => {
  return getRequest<GetOnboardingResponse>(
    `${API_URL}/v1/onboarding`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
