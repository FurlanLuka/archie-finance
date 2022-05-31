import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'apto_user',
})
export class AptoUser {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar')
  aptoUserId: string;

  @Column('varchar')
  accessToken: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
