import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'credit_limit_collateral_transactions',
})
export class CollateralTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  externalTransactionId: string;
}
