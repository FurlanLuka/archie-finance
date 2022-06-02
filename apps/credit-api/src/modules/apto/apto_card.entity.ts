import { Column, Entity } from 'typeorm';

@Entity({
  name: 'apto_card',
})
export class AptoCard {
  @Column('varchar')
  userId: string;

  @Column('varchar')
  cardId: string;
}
