import QRCode from 'react-qr-code';

interface MfaSetupProps {
  secret: string;
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ secret }) => {
  return (
    <div>
      Please enter this secret in your google authenticator
      <h2>{secret}</h2>
      <QRCode
        value={`otpauth://totp/Archie%20MFA?secret=${secret}&issuer=Archie%20Finance`}
      />
      <br />
      <br />
    </div>
  );
};
