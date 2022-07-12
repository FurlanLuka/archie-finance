import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'waitlist',
})
export class Waitlist {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  emailAddress: string;

  @Column('varchar')
  emailIdentifier: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @Column('uuid')
  @Generated('uuid')
  referralCode: string;

  @Column('uuid', { nullable: true })
  referrer: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
