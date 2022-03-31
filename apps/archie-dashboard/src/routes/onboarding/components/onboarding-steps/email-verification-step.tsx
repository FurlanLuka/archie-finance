import { RequestState } from '@archie/api-consumer/interface';
import { usePollEmailVerification } from '@archie/api-consumer/user/hooks/use-poll-email-verification';
import { useResendEmailVerification } from '@archie/api-consumer/user/hooks/use-resend-email-verification';

export const EmailVerificationStep: React.FC = () => {
  usePollEmailVerification();

  const mutationResponse = useResendEmailVerification();

  return (
    <>
      Please check your email for the verification email.
      <br />
      <br />
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
    </>
  );
};
