import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'asset_price_history',
})
export class AssetPriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  asset: string;

  @Column('float')
  price: number;

  @Column('varchar')
  currency: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
