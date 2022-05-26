import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user_vault_account',
})
export class UserVaultAccount {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar', { nullable: false })
  vaultAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
