import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'vault_account',
})
export class VaultAccount {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar', { nullable: false })
  vaultAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
