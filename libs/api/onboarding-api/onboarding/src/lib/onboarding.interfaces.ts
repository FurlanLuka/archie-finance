import { Onboarding } from './onboarding.entity';

export type GetOnboardingResponse = Omit<
  Onboarding,
  'userId' | 'updatedAt' | 'createdAt'
>;

