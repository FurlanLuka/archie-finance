import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'apto_verification',
})
export class AptoVerification {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar')
  verificationId: string;

  @Column('boolean')
  isVerificationCompleted: boolean;
}
