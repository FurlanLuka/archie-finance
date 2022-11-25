import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'scheduler',
})
export class Scheduler {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: false })
  groupId: string;

  @Column('varchar', { nullable: false, unique: true })
  batchId: string;

  @Column('boolean')
  ltvProcessed: boolean;

  @Column('boolean')
  creditLineProcessed: boolean;

  @Column('boolean')
  published: boolean;

  @Column('timestamptz')
  createdAt: string;
}
