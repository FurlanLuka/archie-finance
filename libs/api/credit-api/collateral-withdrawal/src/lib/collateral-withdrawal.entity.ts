import { TransactionStatus } from 'fireblocks-sdk';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'collateral_withdrawal',
})
export class CollateralWithdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('varchar', { nullable: false, select: false })
  userId: string;

  @Column('varchar', { nullable: true, select: false })
  transactionId: string | null;

  @Column('varchar', { nullable: false })
  asset: string;

  @Column('numeric', { nullable: false, precision: 28, scale: 18 })
  currentAmount: string;

  @Column('numeric', { nullable: false, precision: 28, scale: 18 })
  withdrawalAmount: string;

  @Column('numeric', { nullable: true, precision: 28, scale: 18 })
  fee: string | null;

  @Column('varchar', { nullable: true })
  destinationAddress: string;

  @Column('varchar', { nullable: false })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt?: Date;
}
