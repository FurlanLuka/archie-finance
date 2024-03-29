import * as nock from 'nock';
import { Interceptor } from 'nock';

export class BaseNock {
  baseNock: nock.Scope;
  interceptors: nock.Interceptor[] = [];

  constructor(baseUrl: string, apiKey: string) {
    this.baseNock = nock(baseUrl).matchHeader('X-API-KEY', apiKey);
  }

  protected addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }

  public clearInterceptor(interceptor: Interceptor): void {
    nock.removeInterceptor(interceptor);
    this.interceptors = this.interceptors.filter(
      (cachedInterceptor) => cachedInterceptor !== interceptor,
    );
  }

  public cleanAll(): void {
    this.interceptors.forEach((interceptor) => {
      nock.removeInterceptor(interceptor);
    });
    this.interceptors = [];
  }

  public areAllDone(): boolean {
    return this.interceptors.every((interceptor) => {
      return this.isDone(interceptor);
    });
  }

  public isDone(interceptor: Interceptor): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // -  Bad interface
    return interceptor.interceptionCounter > 0;
  }
}
