import { useAuth0 } from '@auth0/auth0-react';

export const LoginRoute: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  // loginWithRedirect();

  return (
    <div className="center-box">
      <h2>Signup</h2>
      <button className={'button'} onClick={() => loginWithRedirect()}>
        Log in
      </button>
    </div>
  );
};
