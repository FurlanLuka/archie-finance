export class AssetInformation {
  coingeckoId: string;
  id: string;
}

export class AssetList {
  [key: string]: Omit<AssetInformation, 'id'>;
}
