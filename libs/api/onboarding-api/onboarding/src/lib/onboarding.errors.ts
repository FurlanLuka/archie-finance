import { BadRequestException } from '@nestjs/common';

export class OnboardingAlreadyCompletedError extends BadRequestException {
  constructor() {
    super('Onboarding already completed');
  }
}
