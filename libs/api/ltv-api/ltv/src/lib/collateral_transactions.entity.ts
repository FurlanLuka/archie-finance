import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from './lib.interfaces';

@Entity({
  name: 'ltv_collateral_transactions',
})
@Index(['externalTransactionId', 'status'], { unique: true })
export class CollateralTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  externalTransactionId: string;

  @Column('varchar', { nullable: false, default: TransactionStatus.initiated })
  status: TransactionStatus;
}
