import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'peach_events',
})
export class PeachEvent {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  lastFetchedPaymentConfirmedEventId: string | null;
}
