// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import NxWelcome from './nx-welcome';

import { Route, Link } from 'react-router-dom';

export function App() {
  return (
    <>
      <NxWelcome title="archie-dashboard" />
      <div />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Route path="/">
        <div>
          This is the generated root route.{' '}
          <Link to="/page-2">Click here for page 2.</Link>
        </div>
      </Route>
      <Route path="/page-2">
        <div>
          <Link to="/">Click here to go back to root page.</Link>
        </div>
      </Route>
      {/* END: routes */}
    </>
  );
}

export default App;
