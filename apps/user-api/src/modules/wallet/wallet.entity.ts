import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'wallet',
})
export class Wallet {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar', { nullable: false })
  walletId: string;

  @Column('varchar', { nullable: false })
  name: string;

  @CreateDateColumn({ select: true })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
