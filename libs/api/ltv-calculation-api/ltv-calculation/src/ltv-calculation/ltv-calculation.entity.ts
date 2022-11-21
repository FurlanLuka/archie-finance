import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Credit {
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
