import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';

export enum WithdrawalStatus {
  INITIATED = 'INITIATED',
  SUBMITTED = 'SUBMITTED',
  FEE_REDUCED = 'FEE_REDUCED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity({
  name: 'withdrawal',
})
export class Withdrawal {
  @PrimaryColumn('varchar')
  internalTransactionId: string;

  @Column('varchar', { nullable: true })
  externalTransactionId: string | null;

  @Column('varchar')
  userId: string;

  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.INITIATED,
  })
  status: WithdrawalStatus;

  @Column('varchar')
  assetId: string;

  @Column('numeric', {
    nullable: false,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  amount: string;

  @Column('numeric', {
    nullable: true,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  networkFee: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
