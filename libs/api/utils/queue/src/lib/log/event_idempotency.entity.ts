import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'event_idempotency',
})
export class Idempotency {
  @PrimaryColumn('varchar')
  id: string;

  @Column('numeric')
  timestamp: number;
}
