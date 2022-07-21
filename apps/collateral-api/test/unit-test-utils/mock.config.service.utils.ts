import { ConfigService } from '@archie/api/utils/config';
import { Provider } from '@nestjs/common';

// eslint-disable-next-line
export const getMockConfigServiceProvider = (): Provider<any> => {
  return {
    provide: ConfigService,
    useValue: {
      get: (config: string) => {
        switch (config) {
          case 'AUTH0_DOMAIN':
            return 'dev.archie.finance';
          case 'ASSET_LIST':
            return {
              BTC: {
                fireblocks_id: 'BTC_TEST',
                coinapi_id: 'BTC',
                network: 'BTC',
              },
              ETH: {
                fireblocks_id: 'ETH_TEST',
                coinapi_id: 'ETH',
                network: 'ERC20',
              },
              SOL: {
                fireblocks_id: 'SOL_TEST',
                coinapi_id: 'SOL',
                network: 'SOL',
              },
              USDC: {
                fireblocks_id: 'USDC_T',
                coinapi_id: 'USDC',
                network: 'ERC20',
              },
            };
        }
      },
    },
  };
};
