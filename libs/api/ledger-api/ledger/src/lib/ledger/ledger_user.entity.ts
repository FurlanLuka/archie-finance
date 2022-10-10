import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'ledger_user',
})
export class LedgerUser {
  @PrimaryColumn('varchar')
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
