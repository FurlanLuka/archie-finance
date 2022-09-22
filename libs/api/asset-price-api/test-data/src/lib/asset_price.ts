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

export const getAssetPricesResponseDataFactory = ({
  btcPrice = 20000,
  ethPrice = 4000,
  solPrice = 50,
  usdcPrice = 1,
}): GetAssetPriceResponse[] => {
  return [
    ['BTC', btcPrice],
    ['ETH', ethPrice],
    ['SOL', solPrice],
    ['USDC', usdcPrice],
  ].map(
    (data): GetAssetPriceResponse =>
      getAssetPriceResponseDataFactory({
        asset: data[0] as string,
        price: data[1] as number,
      }),
  );
};
