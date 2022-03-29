import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export const DashboardRoute: React.FC = () => {
  const { logout, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(console.log);
  });

  return (
    <div className="center-box">
      <h2>Dashboard</h2>
      <code>{JSON.stringify(user)}</code>
      <button className={'button'} onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};
