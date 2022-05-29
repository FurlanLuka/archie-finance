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
  imports: any[];
  inject: any[];
  useFactory: (...args: any[]) => VaultConfig;
}