import { Injectable } from '@nestjs/common';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import {
  CountryCode,
  Configuration,
  LinkTokenCreateResponse,
  PlaidApi,
  PlaidEnvironments,
  Products,
  LinkTokenCreateRequest,
} from 'plaid';

const PLAID_PRODUCTS: Products[] = [Products.Auth];
const PLAID_COUNTRY_CODES: CountryCode[] = [CountryCode.Us];

@Injectable()
export class PlaidApiService {
  private plaidClient: PlaidApi;

  constructor(private configService: ConfigService) {
    const environment = configService.get(ConfigVariables.PLAID_ENVIRONMENT);
    const clientId = configService.get(ConfigVariables.PLAID_CLIENT_ID);
    const secret = configService.get(ConfigVariables.PLAID_SECRET);

    const configuration = new Configuration({
      basePath: PlaidEnvironments[environment],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
    this.plaidClient = new PlaidApi(configuration);
  }

  public async createLinkToken(
    userId: string,
  ): Promise<LinkTokenCreateResponse> {
    const configs: LinkTokenCreateRequest = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Archie',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
    };

    const createTokenResponse = await this.plaidClient.linkTokenCreate(configs);

    return createTokenResponse.data;
  }
}
