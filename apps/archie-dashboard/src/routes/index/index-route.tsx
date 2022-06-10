import { useAuthenticatedSession } from '@archie/session/hooks/use-session';
import { useGetOnboarding } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetOnboardingResponse } from '@archie/api-consumer/onboarding/api/get-onboarding';
import { Navigate } from 'react-router-dom';
import Loading from '../../components/_generic/loading/loading';

export const DashboardRoute: React.FC = () => {
  const { logout } = useAuthenticatedSession();

  const queryResponse: QueryResponse<GetOnboardingResponse> = useGetOnboarding();

  if (queryResponse.state === RequestState.LOADING) {
    return <Loading />;
  }

  if (queryResponse.state === RequestState.SUCCESS) {
    if (!queryResponse.data.completed) {
      return <Navigate to="/onboarding" />;
    }
  }

  return (
    <div className="center-box">
      <h2>Dashboard</h2>
      <button className={'button'} onClick={logout}>
        Logout
      </button>
    </div>
  );
};
