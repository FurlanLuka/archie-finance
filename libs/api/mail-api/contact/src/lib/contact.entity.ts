import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity({
  name: 'contact',
})
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index({ unique: true })
  @Column('varchar')
  userId: string;

  @Column('varchar', { nullable: true })
  encryptedEmail: string | null;

  @Column('varchar', { nullable: true })
  encryptedFirstName: string | null;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
