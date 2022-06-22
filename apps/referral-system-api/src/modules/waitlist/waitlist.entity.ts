import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'waitlist',
})
export class Waitlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  emailAddress: string;

  @Column('varchar')
  emailIdentifier: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @Column('varchar')
  @Generated('uuid')
  referralCode: string;

  @Column('uuid', { nullable: true })
  referrer: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
