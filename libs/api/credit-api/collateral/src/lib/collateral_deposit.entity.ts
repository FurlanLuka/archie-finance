import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BigNumberTrimEndingZerosTransformer } from '@archie/api/utils/typeorm-transformers';

@Entity({
  name: 'collateral_deposit',
})
export class CollateralDeposit {
  @PrimaryColumn('varchar')
  transactionId: string;

  @Column('varchar', { nullable: false })
  userId: string;

  @Column('varchar', { nullable: false })
  asset: string;

  @Column('numeric', {
    nullable: false,
    precision: 28,
    scale: 18,
    transformer: new BigNumberTrimEndingZerosTransformer(),
  })
  amount: string;

  @Column('varchar', { nullable: false })
  status: string;

  @Column('varchar', { nullable: true })
  destinationAddress: string;

  @CreateDateColumn({ select: false })
  createdAt?: Date;

  @UpdateDateColumn({ select: false })
  updatedAt?: Date;
}
