import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { useState } from 'react';

export const KycStep: React.FC = () => {
  const mutationRequest = useCreateKyc();

  const [legalFullName, setLegalFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [ssnDigits, setSsnDigits] = useState<number>();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (mutationRequest.state === RequestState.IDLE) {
          mutationRequest.mutate({
            fullLegalName: legalFullName,
            dateOfBirth: dateOfBirth.toISOString(),
            location,
            ssnDigits,
          });
        }
      }}
    >
      Full legal name
      <br />
      <input
        type="text"
        value={legalFullName}
        onChange={(e) => setLegalFullName(e.target.value)}
        placeholder="John Doe"
      />
      <br />
      <br />
      Date of birth
      <br />
      <input
        type="date"
        value={dateOfBirth.toISOString().slice(0, 10)}
        onChange={(e) => setDateOfBirth(e.target.valueAsDate!)}
        placeholder="Date of birth"
      />
      <br />
      <br />
      Country of residence
      <br />
      <input
        type="string"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="United states"
      />
      <br />
      <br />
      Last 4 SSN digits
      <br />
      <input
        type="number"
        value={ssnDigits}
        onChange={(e) => setSsnDigits(e.target.valueAsNumber)}
        placeholder="XXXX"
      />
      <br /> <br />
      <input type="submit" className="form__button-submit" value="Submit" />
    </form>
  );
};
