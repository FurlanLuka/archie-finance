import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'asset_prices',
})
export class AssetPrices {
  @PrimaryColumn('varchar')
  assetId: string;

  @Column('float')
  price: number;

  @Column('float', { nullable: false })
  dailyChange: number;

  @Column('varchar')
  currency: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
