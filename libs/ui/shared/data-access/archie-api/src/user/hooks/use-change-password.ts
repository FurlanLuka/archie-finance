import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { changePassword, ChangePasswordPayload } from '../api/change-password';

export const useChangePassword = (): MutationQueryResponse<
  void,
  ChangePasswordPayload
> => {
  return useExtendedMutation<void, ChangePasswordPayload>(
    ['change_password_record'],
    changePassword,
  );
};
