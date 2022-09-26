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
  addressStreet: string;

  @Column('varchar', { nullable: false })
  addressStreetNumber: string;

  @Column('varchar', { nullable: false })
  addressLocality: string;

  @Column('varchar', { nullable: false })
  addressCountry: string;

  @Column('varchar', { nullable: false })
  addressRegion: string;

  @Column('varchar', { nullable: false })
  addressPostalCode: string;

  @Column('varchar', { nullable: true })
  phoneNumberCountryCode: string;

  @Column('varchar', { nullable: true })
  phoneNumber: string;

  @Column('varchar', { nullable: false })
  ssn: string;

  @Column('varchar', { nullable: false })
  declaredIncome: string;

  @CreateDateColumn({ select: true })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
