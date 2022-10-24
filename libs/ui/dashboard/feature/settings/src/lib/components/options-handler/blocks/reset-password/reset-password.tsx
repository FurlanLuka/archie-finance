import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CLIENT_ID } from '@archie/ui/shared/constants';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useChangePassword } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-change-password';
import { useGetEmailVerification } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-get-email-verification';

import { ResetPasswordConfirmationModal } from '../../../modals/reset-password-confirmation/reset-password-confirmation';
import { OptionsItem } from '../../../options-item/options-item';

export const ResetPassword: FC = () => {
  const { t } = useTranslation();
  const getEmailVerificationResponse = useGetEmailVerification();
  const changePasswordMutation = useChangePassword();

  const [email, setEmail] = useState('');
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [resetPasswordConfirmatinModalOpen, setResetPasswordConfirmatinModalOpen] = useState(false);

  useEffect(() => {
    if (getEmailVerificationResponse.state === RequestState.SUCCESS) {
      setEmail(getEmailVerificationResponse.data.email);
    }
  }, [getEmailVerificationResponse]);

  useEffect(() => {
    if (changePasswordMutation.state === RequestState.SUCCESS) {
      setResetPasswordConfirmatinModalOpen(true);
      setResetPasswordSent(true);
    }
  }, [changePasswordMutation.state]);

  const handleClick = () => {
    if (changePasswordMutation.state === RequestState.IDLE) {
      changePasswordMutation.mutate({
        email,
        connection: 'Username-Password-Authentication',
        client_id: CLIENT_ID,
      });
    }
  };

  return (
    <>
      <OptionsItem
        title={t('dashboard_settings.password.title')}
        onClick={handleClick}
        isDisabled={resetPasswordSent}
      />
      <ResetPasswordConfirmationModal
        isOpen={resetPasswordConfirmatinModalOpen}
        close={() => setResetPasswordConfirmatinModalOpen(false)}
      />
    </>
  );
};
