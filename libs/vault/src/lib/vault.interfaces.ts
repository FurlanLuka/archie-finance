export interface VaultEncryptionData {
  data: {
    batch_results: {
      ciphertext: string;
    }[];
  };
}

export interface VaultDecryptionData {
  data: {
    batch_results: {
      plaintext: string;
    }[];
  };
}

export interface VaultConfig {
  VAULT_PRIVATE_ADDRESS: string;
  VAULT_USERNAME: string;
  VAULT_PASSWORD: string;
  VAULT_NAMESPACE: string;
}

export interface VaultOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => VaultConfig;
}