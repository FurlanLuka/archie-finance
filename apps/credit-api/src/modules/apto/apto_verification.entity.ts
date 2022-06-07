import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'apto_verification',
})
export class AptoVerification {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar')
  verificationId: string;

  @Column('boolean', { default: false })
  isVerificationCompleted: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
