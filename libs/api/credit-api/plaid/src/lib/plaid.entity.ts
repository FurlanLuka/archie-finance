import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'plaid_access' })
export class PlaidAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('varchar', { nullable: false, select: false })
  userId: string;

  @Column('varchar', { nullable: false, select: false })
  accessToken: string;

  @Column('varchar', { nullable: false, select: false })
  itemId: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
