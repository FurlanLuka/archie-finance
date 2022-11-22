import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'ledger_recalculation',
})
export class LedgerRecalculation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  userId: string;

  @Column('float')
  ltv: number;

  @Column('timestamptz')
  recalculationTriggeredAt: string;

  @Column('timestamptz')
  processedAt: Date;
}
