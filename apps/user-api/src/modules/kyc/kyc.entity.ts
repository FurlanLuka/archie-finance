import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'kyc',
})
export class Kyc {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar', { nullable: false })
  firstName: string;

  @Column('varchar', { nullable: false })
  lastName: string;

  @Column('varchar', { nullable: false })
  dateOfBirth: string;

  @Column('varchar', { nullable: false })
  address: string;

  @Column('varchar', { nullable: true })
  phoneNumberCountryCode: string;

  @Column('varchar', { nullable: true })
  phoneNumber: string;

  @Column('varchar', { nullable: false })
  ssn: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
