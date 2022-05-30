export interface InternalApiConfig {
  internalApiUrl: string;
}

export interface InternalApiOptions {
  imports: any[];
  inject: any[];
  useFactory: (...args: any[]) => InternalApiConfig;
}
