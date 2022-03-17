import { BallTriangle } from 'react-loading-icons';
import { useMemo } from 'react';
import {
  extractQueryParameters,
  getMfaRecord,
  MfaRecord,
} from './mfa-router-helpers';
import { Mfa } from './mfa/mfa';
import { useQuery } from 'react-query';

export const MfaRouter: React.FC = () => {
  const queryParameters = useMemo(() => extractQueryParameters(), []);

  const queryResult = useQuery<MfaRecord>('mfa-record', () =>
    getMfaRecord(queryParameters.sessionToken),
  );

  if (queryResult.status === 'loading') {
    return (
      <div className="mfa-box">
        <BallTriangle fill="#000" />
      </div>
    );
  }

  if (queryResult.status === 'success') {
    return (
      <Mfa
        mfaRecord={queryResult.data}
        sessionToken={queryParameters.sessionToken}
      />
    );
  }

  throw new Error('Invalid response');
};
