import { user } from '../../../../test/test-data/user.data';
import { UserVaultAccount } from '../user_vault_account.entity';

export const getUserVaultAccountEntityData = (
  overrides?: Partial<UserVaultAccount>,
): UserVaultAccount => {
  const defaultEntity: UserVaultAccount = {
    vaultAccountId: 'vaultAccountId',
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...defaultEntity,
    ...overrides,
  };
};
