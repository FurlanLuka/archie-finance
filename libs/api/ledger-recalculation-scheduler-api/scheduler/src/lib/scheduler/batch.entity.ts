import { Column, Entity } from 'typeorm';

@Entity({
  name: 'batch_user',
})
export class BatchUser {
  @Column('uuid')
  batchId: string;

  @Column('varchar', { nullable: false })
  userId: string;
}
