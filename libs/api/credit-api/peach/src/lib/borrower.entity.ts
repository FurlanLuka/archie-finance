import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'borrower',
})
export class Borrower {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index({ unique: true })
  @Column('varchar')
  userId: string;

  @Column('varchar')
  personId: string;

  @Column('varchar', { nullable: true })
  encryptedEmail: string | null;

  @Column('varchar', { nullable: true })
  homeAddressContactId: string | null;

  @Column('varchar', { nullable: true })
  loanId: string | null;
}
