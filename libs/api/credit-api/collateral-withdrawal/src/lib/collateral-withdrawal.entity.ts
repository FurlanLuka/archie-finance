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
  transactionId: string;

  @Column('varchar', { nullable: false })
  asset: string;

  @Column('float', { nullable: false })
  currentAmount: number;

  @Column('float', { nullable: false })
  withdrawalAmount: number;

  @Column('varchar', { nullable: true })
  destinationAddress: string;

  @Column('varchar', { nullable: false })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt?: Date;
}
