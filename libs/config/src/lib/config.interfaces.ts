export interface ConfigOptions {
  requiredEnvironmentVariables: string[];
  parse?: (configVariable: string, value: any) => any;
}
