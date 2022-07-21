export interface DeploymentConfigGeneratorSchema {
  projectName: string;
  includeDatabaseConnectionSecrets: boolean;
  includeAuth0Secrets: boolean;
  includeVaultSecrets: boolean;
}
