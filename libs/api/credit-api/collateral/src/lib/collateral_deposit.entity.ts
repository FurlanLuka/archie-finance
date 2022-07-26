import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('float', { nullable: false })
  amount: number;

  @Column('varchar', { nullable: false })
  status: string;

  @Column('varchar', { nullable: true })
  destinationAddress: string;

  @CreateDateColumn({ select: false })
  createdAt?: Date;

  @UpdateDateColumn({ select: false })
  updatedAt?: Date;
}
