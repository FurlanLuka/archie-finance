export interface AuthConfig {
  domain: string;
  audience: string;
}

export interface AuthOptions {
  imports: any[];
  inject: any[];
  useFactory: (...args: any[]) => AuthConfig;
}
