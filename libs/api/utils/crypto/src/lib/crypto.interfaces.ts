export interface CryptoConfig {
  encryptionKey?: string;
}

export interface CryptoOptions {
  // eslint-ignore-next-line
  imports: any[];
  // eslint-ignore-next-line
  inject: any[];
  // eslint-ignore-next-line
  useFactory: (...args: any[]) => CryptoConfig;
}
