export enum AssetType {
  ERC20 = 'ERC20',
  SOL = 'SOL',
  BTC = 'BTC',
}

export interface AssetList {
  [key: string]: AssetInformation;
}

export interface AssetInformation {
  fireblocks_id: string;
  coinapi_id: string;
  network: AssetType;
}

export enum ConfigVariables {
  AUTH0_DOMAIN = 'AUTH0_DOMAIN',
  AUTH0_AUDIENCE = 'AUTH0_AUDIENCE',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  FIREBLOCKS_VAULT_ACCOUNT_ID = 'FIREBLOCKS_VAULT_ACCOUNT_ID',
  ASSET_LIST = 'ASSET_LIST',
  FIREBLOCKS_API_KEY = 'FIREBLOCKS_API_KEY',
  FIREBLOCKS_PRIVATE_KEY = 'FIREBLOCKS_PRIVATE_KEY',
  FIREBLOCKS_PUBLIC_KEY = 'FIREBLOCKS_PUBLIC_KEY',
  INTERNAL_API_URL = 'INTERNAL_API_URL',
}
