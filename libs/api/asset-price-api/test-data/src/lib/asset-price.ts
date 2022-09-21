import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';

export const getAssetPriceResponseDataFactory = (
  override?: Partial<GetAssetPriceResponse>,
): GetAssetPriceResponse => ({
  asset: 'BTC',
  price: 20000,
  dailyChange: 0,
  currency: 'USD',
  ...override,
});

export const getAssetPricesResponseDataFactory =
  (): GetAssetPriceResponse[] => {
    return [
      ['BTC', 20000],
      ['ETH', 4000],
      ['SOL', 50],
      ['USDC', 1],
    ].map(
      (data): GetAssetPriceResponse =>
        getAssetPriceResponseDataFactory({
          asset: data[0] as string,
          price: data[1] as number,
        }),
    );
  };
