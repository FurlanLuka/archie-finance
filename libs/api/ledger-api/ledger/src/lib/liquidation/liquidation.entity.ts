import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';

export enum LiquidationStatus {
  INITIATED = 'INITIATED',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity({
  name: 'liquidation',
})
export class Liquidation {
  @PrimaryColumn('varchar')
  internalTransactionId: string;

  @Column('varchar', { nullable: true })
  externalTransactionId: string | null;

  @Column('varchar')
  userId: string;

  @Column('varchar')
  status: LiquidationStatus;

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
    nullable: false,
    precision: 28,
    scale: 18,
    default: '0',
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  networkFee: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
