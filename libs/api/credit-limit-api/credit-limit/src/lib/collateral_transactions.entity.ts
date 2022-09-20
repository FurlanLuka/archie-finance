import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from './credit_limit.interfaces';

@Entity({
  name: 'credit_limit_collateral_transactions',
})
@Index(['externalTransactionId', 'status'], { unique: true })
export class CollateralTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  externalTransactionId: string;

  @Column('varchar', { nullable: false, default: TransactionStatus.initiated })
  status: TransactionStatus;
}
