export interface SendgridConfig {
  apiKey: string;
}

export interface SendgridOptions {
  imports: any[];
  inject: any[];
  useFactory: (...args: any[]) => SendgridConfig;
}
