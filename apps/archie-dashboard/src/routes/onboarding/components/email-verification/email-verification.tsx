import { FC } from 'react'
import { RequestState } from '@archie/api-consumer/interface';
import { usePollEmailVerification } from '@archie/api-consumer/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie/api-consumer/user/hooks/use-resend-email-verification';
import { ParagraphS, ParagraphXS } from '../../../../components/_generic/typography/typography.styled';
import { EmailVerificationStyled } from './email-verification.styled'

export const EmailVerification: FC = () => {
  usePollEmailVerification();

  const mutationResponse = useResendEmailVerification();

  return (
    <EmailVerificationStyled>
      
      <div className='text'>
        <ParagraphS weight={700}>Please verify your email</ParagraphS>
        <ParagraphXS weight={700}>Check your email for a verification link from Archie. Click here to resend it.</ParagraphXS>
        <button
          className="button"
          onClick={() => {
            if (mutationResponse.state === RequestState.IDLE) {
              mutationResponse.mutate({});
            }
          }}
        >
          Resend
        </button>
      </div>
    </EmailVerificationStyled>
  );
};
