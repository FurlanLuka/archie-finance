import { MfaSetup } from 'apps/archie-auth/src/components/mfa-setup/mfa-setup';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { MfaRecord } from '../mfa-router-helpers';
import { verifyMfa } from './mfa-helpers';

interface MfaProps {
  mfaRecord: MfaRecord;
  sessionToken: string;
  state: string;
}

interface VerifyMfaMutationProps {
  sessionToken: string;
  state: string;
  totp: string;
}

export const Mfa: React.FC<MfaProps> = ({ mfaRecord, sessionToken, state }) => {
  const [totp, setTotp] = useState('');

  const verifyMfaMutation = useMutation(
    ({ totp, sessionToken, state }: VerifyMfaMutationProps) =>
      verifyMfa(sessionToken, totp, state),
  );

  const handleFormSubmit = (event: any) => {
    event.preventDefault();

    verifyMfaMutation.mutate({
      sessionToken,
      totp,
      state,
    });
  };

  if (verifyMfaMutation.isSuccess) {
    window.location.href = verifyMfaMutation.data.redirectUrl;
  }

  return (
    <div className="mfa-box">
      {mfaRecord.totpSecret && <MfaSetup secret={mfaRecord.totpSecret} />}
      <h2>Please enter the 6-digit code</h2>
      {verifyMfaMutation.isError && <h3>INVALID CODE</h3>}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="form__text-input"
          placeholder={'TOTP'}
          onChange={(event) => setTotp(event.target.value)}
        />
        <input type="submit" className="form__submit-button" value="Submit" />
      </form>
    </div>
  );
};
