import { FC } from 'react';
import { RequestState } from '@archie/api-consumer/interface';
import { usePollEmailVerification } from '@archie/api-consumer/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie/api-consumer/user/hooks/use-resend-email-verification';
import {
  ParagraphS,
  ParagraphXS,
} from '../../../../components/_generic/typography/typography.styled';
import imgResend from '../../../../assets/images/img-resend.png';
import { EmailVerificationStyled } from './email-verification.styled';

export const EmailVerification: FC = () => {
  usePollEmailVerification();

  const mutationResponse = useResendEmailVerification();

  const handleClick = () => {
    if (mutationResponse.state === RequestState.IDLE) {
      mutationResponse.mutate({});
    }
  };

  return (
    <EmailVerificationStyled>
      <div className="image">
        <img src={imgResend} alt="Resend verification email" />
      </div>
      <div className="text">
        <ParagraphS weight={700}>Please verify your email</ParagraphS>
        <ParagraphXS weight={400}>
          Check your email for a verification link from Archie. Click
          <button onClick={handleClick}>here</button>
          to resend it.
        </ParagraphXS>
      </div>
    </EmailVerificationStyled>
  );
};
