import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'onboarding',
})
export class Onboarding {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('boolean', { default: false })
  kycStage: boolean;

  @Column('boolean', { default: false })
  emailVerificationStage: boolean;

  @Column('boolean', { default: false })
  collateralizationStage: boolean;

  @Column('boolean', { default: false })
  cardActivationStage: boolean;

  @Column('boolean', { default: false })
  completed: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
