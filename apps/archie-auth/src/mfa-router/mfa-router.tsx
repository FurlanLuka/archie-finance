import { BallTriangle } from 'react-loading-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  extractQueryParameters,
  getMfaRecord,
  MfaRecord,
} from './mfa-router-helpers';
import { MfaSetup } from './routes/mfa-setup/mfa-setup';
import { Mfa } from './routes/mfa/mfa';
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
    const mfaRecord = queryResult.data;

    if (mfaRecord) {
      if (mfaRecord.totpSecret) {
        return <MfaSetup secret={mfaRecord.totpSecret} />;
      }

      return <Mfa />;
    }
  }

  throw new Error('Invalid response');
};
