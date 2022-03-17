import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorBoundary } from './components/error-boundary/error-boundary';
import { MfaRouter } from './mfa-router/mfa-router';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <MfaRouter />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root'),
);
