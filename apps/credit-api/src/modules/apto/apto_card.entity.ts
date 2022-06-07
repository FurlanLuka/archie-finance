import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'apto_card',
})
export class AptoCard {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar')
  cardId: string;
}
