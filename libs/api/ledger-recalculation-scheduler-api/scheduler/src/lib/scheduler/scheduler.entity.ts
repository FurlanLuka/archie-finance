import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'scheduler',
})
export class Scheduler {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  groupTimestamp: string;

  @Column('varchar', { nullable: false })
  batchId: string;

  @Column('boolean')
  ltvProcessed: boolean;

  @Column('boolean')
  creditLineProcessed: boolean;
}
