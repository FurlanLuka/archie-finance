import * as nock from 'nock';
import { PeachRequestBody, PeachResponse } from './peach';
import {
  Balances,
  CreditLimit,
  Draw,
  Person,
} from '@archie/api/peach-api/data-transfer-objects/types';
import { BaseNock } from '@archie/test/integration';

export class PeachNock extends BaseNock {
  constructor(baseUrl: string, apiKey: string) {
    super(baseUrl, apiKey);
  }

  public setupCreatePersonNock(
    payload: PeachRequestBody,
    replyData: Person,
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post('/people', payload);
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupCreateContactNock(
    personId: string,
    payload: PeachRequestBody,
    replyData: PeachResponse = {},
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/people/${personId}/contacts`,
      payload,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupCreateUserNock(
    companyId: string,
    payload: PeachRequestBody,
    replyData: PeachResponse = {},
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/companies/${companyId}/users`,
      payload,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupCreateLoanNock(
    personId: string,
    payload: PeachRequestBody,
    replyData: PeachResponse = {},
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/people/${personId}/loans`,
      payload,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupActivateLoanNock(
    personId: string,
    loanId: string,
    payload: PeachRequestBody,
    replyData: PeachResponse = {},
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/people/${personId}/loans/${loanId}/activate`,
      payload,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupCreateDrawNock(
    personId: string,
    loanId: string,
    payload: PeachRequestBody,
    replyData: Draw,
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/people/${personId}/loans/${loanId}/draws`,
      payload,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupActivateDrawNock(
    personId: string,
    loanId: string,
    drawId: string,
    replyData: PeachResponse = {},
    replyStatus = 201,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/people/${personId}/loans/${loanId}/draws/${drawId}/activate`,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupUpdateCreditLimitNock(
    personId: string,
    loanId: string,
    payload: PeachRequestBody,
    replyData: CreditLimit,
    replyStatus = 201,
    delay = 0,
  ): nock.Interceptor {
    const interceptor = this.baseNock.post(
      `/people/${personId}/loans/${loanId}/credit-limit`,
    );
    interceptor.delay(delay).reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }

  public setupGetBalancesNock(
    personId: string,
    loanId: string,
    replyData: Balances,
    replyStatus = 200,
  ): nock.Interceptor {
    const interceptor = this.baseNock.get(
      `/people/${personId}/loans/${loanId}/balances`,
    );
    interceptor.reply(replyStatus, { data: replyData });
    this.addInterceptor(interceptor);

    return interceptor;
  }
}
