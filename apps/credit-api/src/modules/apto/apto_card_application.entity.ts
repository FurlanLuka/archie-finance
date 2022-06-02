import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
  AptoCardApplicationNextAction,
  AptoCardApplicationStatus,
} from './apto.interfaces';

@Entity({
  name: 'apto_card_application',
})
export class AptoCardApplication {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar')
  applicationId: string;

  @Column('varchar')
  applicationStatus: AptoCardApplicationStatus;

  @Column('varchar')
  nextAction: AptoCardApplicationNextAction;

  @Column('varchar')
  workflowObjectId: string;

  @Column('varchar')
  nextActionId: string;
}
