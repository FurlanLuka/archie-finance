import React from 'react';
import QRCode from 'react-qr-code';

interface MfaSetupProps {
  secret: string;
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ secret }) => {
  return (
    <div className="mfa-box">
      Please enter this secret in your google authenticator
      <h2>{secret}</h2>
      <QRCode
        value={`otpauth://totp/Archie%20MFA?secret=${secret}&issuer=ArchieFinance`}
      />
      <br />
      To finish MFA setup please input the TOTP
      <form>
        <input
          type="number"
          max={6}
          className="form__text-input"
          placeholder={'TOTP'}
        />
        <input type="submit" className="form__submit-button" value="Submit" />
      </form>
    </div>
  );
};
