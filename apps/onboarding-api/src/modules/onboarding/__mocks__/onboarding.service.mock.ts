export class OnboardingServiceMock {
  public getOrCreateOnboardingRecord: jest.Mock = jest.fn();
  public completeOnboardingStage: jest.Mock = jest.fn();
}
