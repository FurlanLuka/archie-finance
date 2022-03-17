import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorBoundary } from './components/error-boundary/error-boundary';
import { MfaRouter } from './mfa-router/mfa-router';

ReactDOM.render(
  <StrictMode>
    <ErrorBoundary>
      <MfaRouter />
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById('root'),
);
