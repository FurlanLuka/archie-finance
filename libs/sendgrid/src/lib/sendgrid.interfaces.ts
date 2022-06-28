export interface SendgridOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => SendgridConfig;
}

export interface SendgridConfig {
  API_URL: string;
  API_KEY: string;
  MAILING_LIST_ID: string;
}
