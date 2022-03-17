import { BallTriangle } from 'react-loading-icons';
import { useState } from 'react';
import {
  extractQueryParameters,
  getMfaRecord,
  MfaRecord,
} from './mfa-router-helpers';
import useAsyncEffect from 'use-async-effect';
import { MfaSetup } from './routes/mfa-setup/mfa-setup';
import { Mfa } from './routes/mfa/mfa';

export const MfaRouter: React.FC = () => {
  const [mfaRecord, setMfaRecord] = useState<MfaRecord | undefined>();

  useAsyncEffect(async () => {
    const queryParameters = extractQueryParameters();

    const mfaRecord = await getMfaRecord(queryParameters.sessionToken);

    setMfaRecord(mfaRecord);
  }, []);

  if (mfaRecord) {
    if (mfaRecord.totpSecret) {
      return <MfaSetup secret={mfaRecord.totpSecret} />;
    }

    return <Mfa />;
  }
  return (
    <div className="mfa-box">
      <BallTriangle fill="#000" />
    </div>
  );
};
