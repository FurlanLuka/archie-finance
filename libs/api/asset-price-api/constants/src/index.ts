export const SERVICE_NAME = 'asset-price-api'
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`

export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  COINGECKO_API_URI = 'COINGECKO_API_URI',
  ASSET_LIST = 'ASSET_LIST',
}

export interface AssetList {
  [key: string]: AssetInformation;
}

interface AssetInformation {
  fireblocks_id: string;
  coingecko_id: string;
  network: string;
  ltv: number;
  interest: number;
}
