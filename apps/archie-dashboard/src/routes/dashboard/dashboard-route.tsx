import { useAuth0 } from '@auth0/auth0-react';

export const DashboardRoute: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <div className="center-box">
      <h2>Dashboard</h2>
      <button className={'button'} onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};
