import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'apto_card_application',
})
export class AptoCardApplication {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar')
  applicationId: string;

  @Column('varchar')
  applicationStatus: string;

  @Column('varchar')
  workflowObjectId: string;

  @Column('varchar')
  nextActionId: string;
}
