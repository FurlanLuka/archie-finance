import {
  AssetList,
  AssetType,
} from '@archie/api/collateral-api/asset-information';

export const assetListResponseData: AssetList = {
  BTC: {
    fireblocks_id: 'BTC_TEST',
    coingecko_id: 'BTC',
    network: AssetType.BTC,
    ltv: 50,
    interest: 15,
    liquidation_wallet: 'btc_liquidation_wallet',
  },
  ETH: {
    fireblocks_id: 'ETH_TEST',
    coingecko_id: 'ETH',
    network: AssetType.ERC20,
    ltv: 50,
    interest: 15,
    liquidation_wallet: 'eth_liquidation_wallet',
  },
  SOL: {
    fireblocks_id: 'SOL_TEST',
    coingecko_id: 'SOL',
    network: AssetType.SOL,
    ltv: 50,
    interest: 15,
    liquidation_wallet: 'sol_liquidation_wallet',
  },
  USDC: {
    fireblocks_id: 'USDC_T',
    coingecko_id: 'USDC',
    network: AssetType.ERC20,
    ltv: 50,
    interest: 15,
    liquidation_wallet: 'eth_liquidation_wallet',
  },
};
