import { FC, useState, FormEvent } from 'react';
import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { SubtitleS, ParagraphS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { InputText } from '../../../../../components/_generic/input-text/input-text.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors } from '../../../../../constants/theme';
import { step } from '../../../onboarding-route';
import { KycStepStyled } from './kyc-step.styled';

interface KycStepProps {
  setCurrentStep: (step: step) => void;
}

export const KycStep: FC<KycStepProps> = ({ setCurrentStep }) => {
  const mutationRequest = useCreateKyc();

  const [legalFullName, setLegalFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [ssnDigits, setSsnDigits] = useState<number>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mutationRequest.state === RequestState.IDLE) {
      mutationRequest.mutate({
        fullLegalName: legalFullName,
        dateOfBirth: dateOfBirth.toISOString(),
        location,
        ssnDigits,
      });

      setCurrentStep(step.COLLATERALIZE);
    }
  };

  return (
    <KycStepStyled>
      <SubtitleS>A bit about you</SubtitleS>
      <ParagraphS>
        We need to ask some personal information for compliance reasons. This information will not impact your credit
        score or your ability to get the Archie Card.
      </ParagraphS>
      <form onSubmit={(e) => handleSubmit(e)}>
        <InputText>
          Full legal name
          <input
            type="text"
            value={legalFullName}
            onChange={(e) => setLegalFullName(e.target.value)}
            placeholder="John Doe"
          />
        </InputText>
        <InputText>
          Date of birth
          <input
            type="date"
            value={dateOfBirth.toISOString().slice(0, 10)}
            onChange={(e) => setDateOfBirth(e.target.valueAsDate!)}
            placeholder="Date of birth"
          />
        </InputText>
        <InputText>
          Country of residence
          <input
            type="string"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="United states"
          />
        </InputText>
        <InputText>
          Last 4 SSN digits
          <input
            type="number"
            value={ssnDigits}
            onChange={(e) => setSsnDigits(e.target.valueAsNumber)}
            placeholder="XXXX"
          />
        </InputText>
        <hr className="divider" />
        <ButtonPrimary type="submit">
          Next
          <ArrowRight fill={colors.white} />
        </ButtonPrimary>
      </form>
    </KycStepStyled>
  );
};
