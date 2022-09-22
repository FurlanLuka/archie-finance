import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import {
  AssetList,
  AssetType,
} from '@archie/api/collateral-api/asset-information';

export const SOL_PRICE = 100;
export const BTC_PRICE = 20000;
export const ETH_PRICE = 1000;

export const assetPriceResponse: GetAssetPriceResponse[] = [
  {
    asset: 'BTC',
    price: BTC_PRICE,
    currency: 'USD',
    dailyChange: 0,
  },
  {
    asset: 'ETH',
    price: ETH_PRICE,
    currency: 'USD',
    dailyChange: 0,
  },
  {
    asset: 'SOL',
    price: SOL_PRICE,
    currency: 'USD',
    dailyChange: 0,
  },
  {
    asset: 'USDC',
    price: 1,
    currency: 'USD',
    dailyChange: 0,
  },
];

export const assetListResponse: AssetList = {
  BTC: {
    fireblocks_id: 'BTC_TEST',
    coingecko_id: 'bitcoin',
    network: AssetType.BTC,
    ltv: 50,
    interest: 10,
    liquidation_wallet: 'liquidation_wallet',
  },
  ETH: {
    fireblocks_id: 'ETH_TEST',
    coingecko_id: 'ethereum',
    network: AssetType.ERC20,
    ltv: 50,
    interest: 10,
    liquidation_wallet: 'liquidation_wallet',
  },
  SOL: {
    fireblocks_id: 'SOL_TEST',
    coingecko_id: 'solana',
    network: AssetType.SOL,
    ltv: 50,
    interest: 10,
    liquidation_wallet: 'liquidation_wallet',
  },
  USDC: {
    fireblocks_id: 'USDC_T',
    coingecko_id: 'usd-coin',
    network: AssetType.ERC20,
    ltv: 70,
    interest: 10,
    liquidation_wallet: 'liquidation_wallet',
  },
};
