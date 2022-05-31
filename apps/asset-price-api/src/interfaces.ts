export enum ConfigVariables {
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  COINAPI_KEY = 'COINAPI_KEY',
  COINAPI_WEBSOCKET_URI = 'COINAPI_WEBSOCKET_URI',
  ASSET_LIST = 'ASSET_LIST',
}

export interface AssetList {
  [key: string]: AssetInformation;
}

interface AssetInformation {
  fireblocks_id: string;
  coinapi_id: string;
  network: string;
  ltv: number;
  interest: number;
}
