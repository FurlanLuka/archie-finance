import { render } from '@testing-library/react';

import ArchieDashboardFeatureOnboarding from './archie-dashboard-feature-onboarding';

describe('ArchieDashboardFeatureOnboarding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ArchieDashboardFeatureOnboarding />);
    expect(baseElement).toBeTruthy();
  });
});
