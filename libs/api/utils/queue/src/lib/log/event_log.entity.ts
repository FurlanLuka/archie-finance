import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'event_log',
})
export class EventLog {
  @PrimaryColumn('varchar')
  id: string;

  @Column('numeric')
  timestamp: number;

  @Column('json')
  message: object;
}
